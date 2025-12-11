# 陆家花园数据库 Schema - 水宇宙扩展

> **版本**: v1.0 (草稿)
> **创建日期**: 2025-12-11
> **状态**: 🟡 草稿

## 概述

本文档定义水宇宙（基于肖水《十二个故事集》）的数据模型扩展。

### 与毛小豆宇宙的差异

| 维度 | 毛小豆宇宙 | 水宇宙 |
|------|-----------|--------|
| 诗歌长度 | 长诗，多诗节 | 短诗（4行左右） |
| 组织结构 | Section | Collection（故事集） |
| 核心维度 | 角色、场景 | 地理、时间 |
| 叙事单元 | Stanza | Poem 本身 |

---

## 新增表定义

### ShuiCollection（故事集）

存储12个故事集的元数据。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | String | PK | 格式: `shui_collection_{nameEn}` |
| name | String | NOT NULL | 故事集中文名，如"渤海故事集" |
| nameEn | String | NOT NULL | 故事集英文标识，如"bohai" |
| dedication | String | NULL | 献词（仅南溪故事集有） |
| dateStart | String | NOT NULL | 创作起始日期，格式"YYYY.M" |
| dateEnd | String | NOT NULL | 创作结束日期，格式"YYYY.M" |
| regions | String | NULL | JSON数组：涉及地域 |
| poemCount | Int | NOT NULL | 诗歌数量 |
| description | String | NULL | 故事集描述 |
| universeId | String | FK | 关联 Universe.id |

**唯一约束**: `(universeId, nameEn)`

### ShuiPoem（诗歌）

存储120+首小说诗。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | String | PK | 格式: `shui_poem_{collectionNameEn}_{index}` |
| collectionId | String | FK | 关联 ShuiCollection.id |
| title | String | NOT NULL | 诗题（多为地名） |
| content | String | NOT NULL | 诗歌全文 |
| date | String | NOT NULL | 创作日期，格式"YYYY.M.D" |
| location | String | NULL | 主要地点（从诗题或内容提取） |
| index | Int | NOT NULL | 在故事集中的序号（从1开始） |
| metadata | String | NULL | JSON：扩展元数据 |
| universeId | String | FK | 关联 Universe.id |

**唯一约束**: `(universeId, collectionId, title)`

---

## 关系图

```
Universe (shui)
    │
    └── ShuiCollection (12)
            │
            └── ShuiPoem (120+)
```

---

## 统计信息

| 实体 | 预期记录数 |
|------|-----------|
| ShuiCollection | 12 |
| ShuiPoem | 109 |

### 12个故事集分布

| 序号 | nameEn | name | poemCount | 特殊说明 |
|------|--------|------|-----------|----------|
| 1 | bohai | 渤海故事集 | 10 | |
| 2 | taiyuan | 太原故事集 | 10 | |
| 3 | jiangdong | 江东故事集 | 10 | |
| 4 | nanling | 南岭故事集 | 10 | |
| 5 | shanghai | 上海故事集 | 10 | |
| 6 | yunque | 云雀故事集 | 10 | |
| 7 | molu | 末路故事集 | 10 | |
| 8 | nanxi | 南溪故事集 | 10 | 有献词 |
| 9 | zidu | 自渡故事集 | 10 | |
| 10 | shizhiba | 十之八九故事集 | 5 | 长篇叙事诗(5节) |
| 11 | dangzhou | 当昼有人客故事集 | 4 | 长篇叙事诗 |
| 12 | piruzhao | 譬如朝露故事集 | 10 | |

---

## Prisma Schema 附录

```prisma
model ShuiCollection {
  id String @id
  name String
  nameEn String
  dedication String?
  dateStart String
  dateEnd String
  regions String?      // JSON
  poemCount Int
  description String?
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  poems ShuiPoem[]
  @@unique([universeId, nameEn])
}

model ShuiPoem {
  id String @id
  collectionId String
  title String
  content String
  date String
  location String?
  index Int
  metadata String?     // JSON
  universeId String
  collection ShuiCollection @relation(fields: [collectionId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
  @@unique([universeId, collectionId, title])
}
```

---

## 变更历史

| 日期 | 版本 | 变更说明 |
|------|------|----------|
| 2025-12-11 | v1.0 | 初始草稿 |

---

*本文档遵循陆家花园数据库设计规范*
