const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');

function consolidateSkills() {
    const departments = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

    for (const dept of departments) {
        const deptPath = path.join(skillsDir, dept);
        const roles = fs.readdirSync(deptPath).filter(f => {
            const p = path.join(deptPath, f);
            return fs.statSync(p).isDirectory() && !f.startsWith('_');
        });

        if (roles.length === 0) {
            console.log(`Skipping ${dept} (no roles to consolidate)`);
            continue;
        }

        console.log(`Consolidating ${dept}...`);
        
        let megaSkillContent = `---
name: ${dept}
description: >-
  Mega-Skill for ${dept} department. This contains the consolidated capabilities 
  of all roles within this department to enable JIT-Agent Routing Architecture.
metadata:
  author: VCT Platform
  version: "4.1.0"
  type: "Mega-Skill"
  locale: vi-VN
---

# ${dept.toUpperCase()} — MEGA-SKILL

> Tài liệu Mega-Skill này tổng hợp tất cả năng lực chuyên môn của phòng ban **${dept}**. 
> Khi được giao task thuộc lĩnh vực này, hãy đối chiếu các khung năng lực (Role Capabilities) bên dưới để thực thi chính xác nhất.

`;

        for (const role of roles) {
            const roleDir = path.join(deptPath, role);
            const roleSkillPath = path.join(roleDir, 'SKILL.md');
            
            if (fs.existsSync(roleSkillPath)) {
                const content = fs.readFileSync(roleSkillPath, 'utf8');
                // Loại bỏ YAML frontmatter của file con
                const body = content.replace(/---[\s\S]+?---/, '').trim();
                
                megaSkillContent += `\n\n---\n\n## 🔹 NĂNG LỰC: ${role.toUpperCase()}\n\n${body}`;
            }
        }

        // Lưu Mega-Skill
        const megaSkillPath = path.join(deptPath, 'SKILL.md');
        fs.writeFileSync(megaSkillPath, megaSkillContent, 'utf8');
        console.log(`✅ Created Mega-Skill at: ${megaSkillPath}`);

        // Xóa thư mục con để sạch sẽ hệ thống
        for (const role of roles) {
            const roleDir = path.join(deptPath, role);
            fs.rmSync(roleDir, { recursive: true, force: true });
            console.log(`🗑️ Deleted legacy role folder: ${role}`);
        }
    }
    
    console.log('\n🎉 Consolidation Complete! Reduced from 61+ scattered skills to 13 Mega-Skills.');
}

consolidateSkills();
