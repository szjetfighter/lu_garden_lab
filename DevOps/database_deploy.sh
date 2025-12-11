#!/bin/bash
# ============================================
# 数据库部署脚本
# 用于lugarden.db schema变更后的VPS部署
# ============================================

set -e  # 遇到错误立即退出

DATA_DIR="lugarden_universal/application/data"

echo "=== 陆家花园数据库部署 ==="
echo ""

# 1. 停止容器
echo "[1/6] 停止容器..."
docker-compose down

# 2. 拉取代码（先pull，防止本地意外提交的WAL文件）
echo "[2/6] 拉取最新代码..."
git pull

# 3. 清理WAL文件（pull后清理，确保清理掉任何来源的WAL）
echo "[3/6] 清理WAL文件..."
rm -f ${DATA_DIR}/*.db-wal
rm -f ${DATA_DIR}/*.db-shm
echo "      已清理WAL/SHM文件"

# 4. 修复数据库文件权限（精确控制，避免777）
echo "[4/6] 修复数据库权限..."
# 递归修改data目录下的所有内容（nodejs用户 UID=1001）
chown -R 1001:1001 ${DATA_DIR}
chmod 755 ${DATA_DIR}
echo "      权限已修复 (owner=1001, dir=755)"

# 5. WAL双重保险（Shell层显式设置，防止代码层故障）
echo "[5/6] 设置WAL模式..."
sqlite3 ${DATA_DIR}/lugarden.db "PRAGMA journal_mode=WAL;" || echo "      警告: lugarden.db WAL设置失败"
sqlite3 ${DATA_DIR}/auth.db "PRAGMA journal_mode=WAL;" || echo "      警告: auth.db WAL设置失败"
echo "      WAL模式已设置"

# 6. 重建并启动
echo "[6/6] 重建并启动容器..."
docker-compose build --no-cache app
docker-compose up -d

# 等待启动
echo ""
echo "等待容器启动..."
sleep 5

# 检查日志确认WAL模式
echo ""
echo "=== 检查WAL初始化 ==="
docker logs lugarden-app --tail 10 | grep -E "\[DB\]|journal_mode" || echo "(未找到WAL日志，请手动检查)"

echo ""
echo "=== 部署完成 ==="
echo "验证: https://lugarden.space"
