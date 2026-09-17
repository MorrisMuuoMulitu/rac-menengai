# Clone Notes — Rotaract Club of Menengai (content overhaul of rcncrotaract.org clone)

> 内容爆改 + UI 全面升级：保留品牌设计令牌（粉 #C21F5D + 深蓝 #1C2734），重做为更现代、更动感的单页（玻璃拟态、滚动揭示、数字动画、跑马灯、轮播导航）。内容全部换成 Rotaract Club of Menengai 的真实素材与事实。设计 DNA 见 `RECON/design-dna.json`。

## 品牌与事实（来源：club 社交主页 + LinkedIn + 新闻报道）
- **Club:** Rotaract Club of Menengai (RAC Menengai) · Nakuru, Kenya · Rotary District 9212
- **Sponsor mother club:** Rotary Club of Nakuru（宪章 ~2015/16，2025 庆祝 10 周年）
- **Meeting:** Thursday fellowship 5:30–6:30 PM
- **Awards:** Legacy Award 2026 — DEI Champion（District 9212）；2019 总统 Terry Muigai；2025/26 总统 Janet Nkirote（Peace in Colour Fest 主持人）；宪章主席 John Brodrick；2026/27 总统 Joyce Wanjiku Nguru
- **Projects:** Adopt-a-River (River Njoro/Barut, 水过滤装置 + Mwariki Bridge 清理 + 垃圾容器)、River Ndarugu 清理、Bondeni Maternity mother packs、Limuko High School 405 名女生卫生巾捐赠、Interact Club of Nakuru Day 150 份捐赠、Pangani Special School 植树、street families 街头援助、Peace in Colour Fest 2025、城市清洁活动（2024 副州长 David Kones 发起）
- **Socials:** Facebook @RCmenengai · Instagram @racmenengai · X @RcMenengai · LinkedIn RAC Menengai · Threads @racmenengai

## 资产（真实，来源注明）
| 文件 | 来源 |
|---|---|
| `assets/images/menengai/logo-transparent.png` | club X profile emblem（原 logo.jpg 去黑底） |
| `assets/images/menengai/banner.jpg` | club X banner（hero 背景，Ken Burns 动画） |
| `assets/images/menengai/adopt-river.jpg` | LinkedIn 发布图（Adopt-a-River 启动） |
| `assets/images/menengai/river-cleanup.jpg` | LinkedIn 发布图（River Ndarugu 清理） |
| `assets/images/menengai/welcome.jpg` | LinkedIn 发布图（club 欢迎） |
| `assets/images/menengai/cleanup-campaign.jpg` | Nakuru County 官网新闻图（城市清洁活动） |

## UI 升级（相对 v1 视觉语法）
- **Hero:** 全屏 banner + 三色渐变遮罩 + Ken Burns 背景 + 光晕浮动 + 数据条（10+ 年 / D9212 / 周四例会 / DEI Champion）
- **动效:** 滚动揭示（IntersectionObserver）、数字增长动画、无限跑马灯 ticker、轮播箭头、sticky 头部毛玻璃 + 滚动进度条
- **区块:** Stats 数字卡 · About 拼贴图 + 浮动徽章 · 三支柱 Values · Rotary 七大焦点 · Projects 轮播 · 深色签名项目 · Awards 轮播 · Leadership 三人卡 · 渐变 Join CTA · News 轮播 · Partners 文字卡
- **设计令牌保留:** 粉 + 深蓝渐变、Open Sans + Georgia、圆角卡片
- **替换:** 站名、hero、全部文案、新闻/奖项/项目数据、合作方（真实名单文字卡）、页脚
- **删除:** 商品区（前一轮）、RCNC 特有 Trust Fund → "Adopt-a-River 签名项目"

## 已知缺口
- 无官方邮箱/电话（用户未提供）→ 页脚用 Facebook/Instagram 联系
- 合作方无 logo 素材 → 用文字卡展示真实名单
- 无俱乐部专属网站/博客 → 新闻卡片链接到 Instagram 主页
- 商品/购物车（WooCommerce）不克隆

## Run
```bash
python3 -m http.server 8080   # 在项目根目录
# 打开 http://127.0.0.1:8080/
```

## 原站克隆背景（rcncrotaract.org → Menengai 改造前的设计令牌）
- 原站: WordPress 7.1 · Impreza 8.35.2（商业主题）· WPBakery · WooCommerce；无公开源码，按渲染 HTML 高保真重建
- 设计令牌（保留不变）：`--accent #C21F5D` · `--secondary #1C2734` · `--text #333333` · `--muted #999999` · `--border #e8e8e8` · `--surface-alt #ffe6ef` · body #f5f5f5 · footer #333333 / #C21F5D · hero overlay rgba(28,39,52,0.45)
- 字体：Open Sans（自托管变量 300–800）+ Georgia
- 按钮：btn-1 实心粉 / btn-28 描边粉 / btn-29 描边深蓝（均 radius 1rem 0 1rem 0，hover 深蓝填充）
- 验证记录：console 0 错误；390/768/1024/1440 无横向溢出；audit-clone --strict 字体/图片/颜色硬伤 0；交互探针通过
- 许可：Impreza 商业主题不可分发；RCNC 图片/文案版权归其俱乐部；Menengai 站图片取自其公开社交主页，公开部署前建议与俱乐部确认授权
