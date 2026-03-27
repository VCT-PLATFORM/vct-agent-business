# Master Agent (Chief of Staff) Orchestrator

## Vai trò
**Master Agent** đóng vai trò là "Lõi trung tâm" (Hub) hoặc "Chánh văn phòng" (Chief of Staff). 
Nhà điều hành (Trực tiếp là bạn - User) CHỈ CẦN giao tiếp qua Master Agent này.

## Luồng hoạt động (Workflow)

```mermaid
sequenceDiagram
    participant User
    participant MasterAgent as Master Agent (Chief of Staff)
    participant Manifest as Master Indexes (SOPs/Workflows)
    participant SubAgents as Specialized Agents (CMO, CTO, HR...)

    User->>MasterAgent: Yêu cầu phức tạp (VD: "Lên plan launch sản phẩm X")
    MasterAgent->>Manifest: Tra cứu Workflow & SOP liên quan
    MasterAgent-->>MasterAgent: Lập Delegation Plan (Kế hoạch phân quyền)
    
    MasterAgent->>SubAgents: Khởi tạo Task 1 (VD: Giao PM viết PRD - SOP-401)
    SubAgents-->>MasterAgent: Trả kết quả (PRD)
    
    MasterAgent->>SubAgents: Khởi tạo Task 2 (VD: Giao CMO lập Campaign - SOP-202)
    SubAgents-->>MasterAgent: Trả kết quả (Marketing Plan)
    
    MasterAgent-->>MasterAgent: Tổng hợp, kiểm tra chéo (Debate nếu cần)
    MasterAgent->>User: Báo cáo Executive Summary + Kế hoạch hoàn chỉnh
```

## Các tính năng cốt lõi
1. **Intent Recognition**: Hiểu yêu cầu người dùng bằng ngôn ngữ tự nhiên.
2. **Context Routing**: Tự động map yêu cầu với `WF-xxx` (Workflow) hoặc `SOP-xxx`.
3. **Execution Planning**: Chia việc lớn thành N việc nhỏ có thứ tự execution.
4. **Agent Delegation**: Spin up đúng agent (VD: `MarketingManager`, `TechLead`) với đúng file `SKILL.md` của agent đó.
5. **Memory Management**: Lưu lại ngữ cảnh chung vào `_shared_memory/`.
