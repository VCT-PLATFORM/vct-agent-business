/**
 * DVCQG Agent — Tra cứu Cổng Dịch vụ Công Quốc gia (dichvucong.gov.vn)
 *
 * Tự động scrape dữ liệu hướng dẫn thủ tục hành chính cho doanh nghiệp.
 * Tích hợp vào Telegram Bot để Chairman có thể tra cứu ngay trên điện thoại.
 */

const axios = require('axios');

const BASE_URL = 'https://dichvucong.gov.vn';

// ─── Bản đồ danh mục Doanh nghiệp ─────────────────────────────────
const BUSINESS_CATEGORIES = {
  'khoi-su':       { id: 760, name: 'Khởi sự kinh doanh' },
  'lao-dong':      { id: 761, name: 'Lao động và Bảo hiểm xã hội' },
  'tai-chinh':     { id: 762, name: 'Tài chính doanh nghiệp' },
  'dat-dai':       { id: 763, name: 'Điện lực, Đất đai, Xây dựng' },
  'thuong-mai':    { id: 764, name: 'Thương mại, Quảng cáo' },
  'so-huu-tri-tue':{ id: 765, name: 'Sở hữu trí tuệ, Đăng ký tài sản' },
  'chi-nhanh':     { id: 766, name: 'Thành lập chi nhánh, VP đại diện' },
  'dau-thau':      { id: 767, name: 'Đấu thầu, Mua sắm công' },
  'tai-cau-truc':  { id: 768, name: 'Tái cấu trúc doanh nghiệp' },
  'tam-dung':      { id: 769, name: 'Tạm dừng, Chấm dứt hoạt động' },
  'tranh-chap':    { id: 791, name: 'Giải quyết tranh chấp hợp đồng' },
};

// Bản đồ keywords → category (để matching tự nhiên)
const KEYWORD_MAP = {
  'thành lập': 'khoi-su', 'đăng ký kinh doanh': 'khoi-su', 'khởi sự': 'khoi-su', 'mở công ty': 'khoi-su',
  'lao động': 'lao-dong', 'bảo hiểm': 'lao-dong', 'bhxh': 'lao-dong', 'hợp đồng lao động': 'lao-dong',
  'thuế': 'tai-chinh', 'tài chính': 'tai-chinh', 'kế toán': 'tai-chinh', 'hóa đơn': 'tai-chinh', 'ngân hàng': 'tai-chinh',
  'đất đai': 'dat-dai', 'xây dựng': 'dat-dai', 'điện lực': 'dat-dai', 'giấy phép xây dựng': 'dat-dai',
  'thương mại': 'thuong-mai', 'quảng cáo': 'thuong-mai', 'xuất nhập khẩu': 'thuong-mai',
  'sở hữu trí tuệ': 'so-huu-tri-tue', 'bản quyền': 'so-huu-tri-tue', 'thương hiệu': 'so-huu-tri-tue', 'nhãn hiệu': 'so-huu-tri-tue',
  'chi nhánh': 'chi-nhanh', 'văn phòng đại diện': 'chi-nhanh',
  'đấu thầu': 'dau-thau', 'mua sắm công': 'dau-thau',
  'sáp nhập': 'tai-cau-truc', 'tái cấu trúc': 'tai-cau-truc', 'chia tách': 'tai-cau-truc',
  'giải thể': 'tam-dung', 'tạm dừng': 'tam-dung', 'chấm dứt': 'tam-dung', 'phá sản': 'tam-dung',
  'tranh chấp': 'tranh-chap', 'kiện': 'tranh-chap', 'hợp đồng': 'tranh-chap',
};

/**
 * Tìm category phù hợp từ câu hỏi tự nhiên.
 */
function detectCategory(query) {
  const q = query.toLowerCase();
  for (const [keyword, catKey] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(keyword)) {
      return { key: catKey, ...BUSINESS_CATEGORIES[catKey] };
    }
  }
  return null;
}

/**
 * Lấy thông tin chi tiết 1 câu hỏi từ cổng DVCQG.
 */
async function fetchQuestionDetail(questionId) {
  try {
    const url = `${BASE_URL}/p/home/dvc-chi-tiet-cau-hoi.html?id=${questionId}&row_limit=1`;
    const { data } = await axios.get(url, { timeout: 10000 });
    // Trích xuất nội dung text (loại HTML tags)
    const textContent = data
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    // Cắt lấy phần nội dung chính (giới hạn 2000 ký tự)
    const mainContent = textContent.substring(0, 2000);
    return mainContent;
  } catch (err) {
    return `Không thể tải nội dung. Lỗi: ${err.message}`;
  }
}

/**
 * Lấy danh sách thủ tục + FAQ của một nhóm doanh nghiệp.
 */
async function fetchCategoryInfo(groupId) {
  try {
    const url = `${BASE_URL}/p/home/dvc-chi-tiet-nhom-su-kien-cho-doanh-nghiep.html?group=${groupId}`;
    const { data } = await axios.get(url, { timeout: 10000 });

    // Trích xuất các tiêu đề thủ tục và link FAQ
    const procedures = [];
    const faqLinks = [];

    // Lấy tiêu đề thủ tục
    const procRegex = /dvc-chi-tiet-thu-tuc[^"]*"[^>]*>([^<]+)/gi;
    let match;
    while ((match = procRegex.exec(data)) !== null) {
      procedures.push(match[1].trim());
    }

    // Lấy FAQ
    const faqRegex = /dvc-chi-tiet-cau-hoi\.html\?id=(\d+)[^"]*"[^>]*>([^<]+)/gi;
    while ((match = faqRegex.exec(data)) !== null) {
      faqLinks.push({ id: match[1], question: match[2].trim() });
    }

    return { procedures: [...new Set(procedures)].slice(0, 10), faqLinks: faqLinks.slice(0, 5) };
  } catch (err) {
    return { procedures: [], faqLinks: [], error: err.message };
  }
}

/**
 * Tra cứu thủ tục hành chính theo keyword (search).
 */
async function searchTTHC(keyword) {
  try {
    const url = `${BASE_URL}/p/home/dvc-tra-cuu-tthc.html?keyword=${encodeURIComponent(keyword)}`;
    const { data } = await axios.get(url, { timeout: 10000 });

    const results = [];
    // Parse kết quả tìm kiếm
    const resultRegex = /dvc-chi-tiet-thu-tuc\.html\?ma=[^"]*"[^>]*>([^<]+)/gi;
    let match;
    while ((match = resultRegex.exec(data)) !== null) {
      results.push(match[1].trim());
    }

    return [...new Set(results)].slice(0, 10);
  } catch (err) {
    return [];
  }
}

/**
 * Tổng hợp: xử lý một câu hỏi từ Chairman và trả kết quả.
 */
async function handleQuery(query) {
  const lines = [];
  lines.push(`🏛️ *TRA CỨU CỔNG DỊCH VỤ CÔNG QUỐC GIA*\n`);

  // 1. Detect category
  const cat = detectCategory(query);

  if (cat) {
    lines.push(`📁 *Lĩnh vực:* ${cat.name}`);
    lines.push(`🔗 [Xem trên DVCQG](${BASE_URL}/p/home/dvc-chi-tiet-nhom-su-kien-cho-doanh-nghiep.html?group=${cat.id})\n`);

    // 2. Fetch category data
    const info = await fetchCategoryInfo(cat.id);

    if (info.procedures.length > 0) {
      lines.push(`📋 *Thủ tục liên quan:*`);
      info.procedures.forEach((p, i) => {
        lines.push(`${i + 1}. ${p}`);
      });
      lines.push('');
    }

    if (info.faqLinks.length > 0) {
      lines.push(`❓ *Câu hỏi thường gặp:*`);
      info.faqLinks.forEach((faq) => {
        lines.push(`• ${faq.question}`);
      });
      lines.push('');
    }
  }

  // 3. Search TTHC
  const searchResults = await searchTTHC(query);
  if (searchResults.length > 0) {
    lines.push(`🔍 *Kết quả tìm kiếm "${query}":*`);
    searchResults.forEach((r, i) => {
      lines.push(`${i + 1}. ${r}`);
    });
    lines.push('');
  }

  if (!cat && searchResults.length === 0) {
    lines.push(`⚠️ Jen không tìm thấy thông tin liên quan đến "${query}".`);
    lines.push(`\nNgài thử dùng từ khóa cụ thể hơn, hoặc chọn danh mục bên dưới:`);
    lines.push(`\n📂 *Danh mục Doanh nghiệp:*`);
    for (const [, cat] of Object.entries(BUSINESS_CATEGORIES)) {
      lines.push(`• ${cat.name}`);
    }
  }

  lines.push(`\n📞 Tổng đài hỗ trợ DVCQG: *18001096*`);

  return lines.join('\n');
}

/**
 * Hiển thị danh mục cho Telegram.
 */
function getMenuText() {
  const lines = [`🏛️ *CỔNG DỊCH VỤ CÔNG QUỐC GIA — DOANH NGHIỆP*\n`];
  lines.push('Ngài có thể tra cứu theo các danh mục sau:\n');

  for (const [key, cat] of Object.entries(BUSINESS_CATEGORIES)) {
    lines.push(`📁 ${cat.name}`);
  }

  lines.push(`\n💡 *Cách dùng:* Gõ /dvcqg [từ khóa]`);
  lines.push(`VD: /dvcqg đăng ký kinh doanh`);
  lines.push(`VD: /dvcqg thuế`);
  lines.push(`VD: /dvcqg sở hữu trí tuệ`);

  return lines.join('\n');
}

module.exports = {
  BUSINESS_CATEGORIES,
  detectCategory,
  fetchCategoryInfo,
  fetchQuestionDetail,
  searchTTHC,
  handleQuery,
  getMenuText,
};
