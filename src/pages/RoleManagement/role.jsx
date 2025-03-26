import React, { useState, useEffect } from 'react';
import './role.scss';

/**
 * 角色管理组件
 * 实现角色的展示、搜索、分页、添加、编辑、删除等功能
 */
function RoleManagement() {
    // 搜索条件状态
    const [roleName, setRoleName] = useState(''); // 角色名称搜索条件
    const [permission, setPermission] = useState(''); // 权限字符搜索条件
    const [status, setStatus] = useState(''); // 状态搜索条件
    const [startDate, setStartDate] = useState(''); // 创建时间范围起始日期
    const [endDate, setEndDate] = useState(''); // 创建时间范围结束日期
    
    // 角色数据状态
    const [roles, setRoles] = useState([
        { id: 1, name: '超级管理员', permission: 'admin', order: 1, status: '正常', created: '2025-02-24 17:35:49' },
        { id: 2, name: '普通角色', permission: 'common', order: 2, status: '正常', created: '2025-02-24 17:35:49' },
        { id: 3, name: '测试角色', permission: 'test', order: 3, status: '正常', created: '2025-01-24 17:35:49' },        
    ]); // 所有角色数据
    const [filteredRoles, setFilteredRoles] = useState(roles); // 筛选后的角色数据
    
    // 选择状态
    const [selectAll, setSelectAll] = useState(false); // 是否全选
    const [selectedRoles, setSelectedRoles] = useState([]); // 已选择的角色ID数组
    
    // 删除对话框状态
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // 是否显示删除确认对话框
    const [deleteId, setDeleteId] = useState(null); // 要删除的角色ID
    
    // 分页相关状态
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(10); // 每页显示数量
    const [totalPages, setTotalPages] = useState(1); // 总页数
    const [displayedRoles, setDisplayedRoles] = useState([]); // 当前页显示的角色数据

    /**
     * 当过滤后的角色列表或分页参数变化时，更新显示的角色列表和总页数
     */
    useEffect(() => {
        // 计算总页数
        const total = Math.ceil(filteredRoles.length / pageSize);
        setTotalPages(total || 1);
        
        // 如果当前页大于总页数，重置为第一页
        if (currentPage > total && total > 0) {
            setCurrentPage(1);
        }
        
        // 计算当前页应该显示的数据
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedRoles(filteredRoles.slice(startIndex, endIndex));
    }, [filteredRoles, currentPage, pageSize]);

    /**
     * 处理搜索操作
     * 根据搜索条件筛选角色列表
     */
    const handleSearch = () => {
        const filtered = roles.filter(role => 
            (roleName === '' || role.name.includes(roleName)) &&
            (permission === '' || role.permission.includes(permission)) &&
            (status === '' || role.status === status) &&
            (startDate === '' || new Date(role.created) >= new Date(startDate)) &&
            (endDate === '' || new Date(role.created) <= new Date(endDate))
        );
        setFilteredRoles(filtered);
        setCurrentPage(1); // 搜索后重置为第一页
    };

    /**
     * 重置搜索条件
     * 清空所有搜索框并重置筛选结果
     */
    const handleReset = () => {
        setRoleName('');
        setPermission('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setFilteredRoles(roles);
        setCurrentPage(1); // 重置后回到第一页
    };

    /**
     * 处理全选/取消全选
     * 切换全选状态并更新已选择的角色列表
     */
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        if (newSelectAll) {
            // 全选当前页的所有角色
            setSelectedRoles(displayedRoles.map(role => role.id));
        } else {
            // 取消全选
            setSelectedRoles([]);
        }
    };

    /**
     * 处理单个角色的选择/取消选择
     * @param {number} id - 角色ID
     */
    const handleSelectRole = (id) => {
        if (selectedRoles.includes(id)) {
            // 如果已选中，则取消选择
            setSelectedRoles(selectedRoles.filter(roleId => roleId !== id));
        } else {
            // 如果未选中，则添加到已选择列表
            setSelectedRoles([...selectedRoles, id]);
        }
    };

    /**
     * 处理删除操作
     * 检查是否有选中的角色，并显示删除确认对话框
     */
    const handleDelete = () => {
        if (selectedRoles.length === 0) {
            alert('请选择要删除的角色');
            return;
        }
        setShowDeleteDialog(true);
    };

    /**
     * 确认删除操作
     * 从角色列表中移除选中的角色
     */
    const confirmDelete = () => {
        const newRoles = roles.filter(role => !selectedRoles.includes(role.id));
        setRoles(newRoles);
        setFilteredRoles(newRoles);
        setSelectedRoles([]);
        setSelectAll(false);
        setShowDeleteDialog(false);
    };

    /**
     * 取消删除操作
     * 关闭删除确认对话框
     */
    const cancelDelete = () => {
        setShowDeleteDialog(false);
    };

    /**
     * 切换角色状态（正常/停用）
     * @param {number} id - 角色ID
     */
    const toggleRoleStatus = (id) => {
        // 更新roles数组中的状态
        const updatedRoles = roles.map(role => {
            if (role.id === id) {
                return {
                    ...role,
                    status: role.status === '正常' ? '停用' : '正常'
                };
            }
            return role;
        });
        
        setRoles(updatedRoles);
        
        // 同步更新筛选后的角色列表
        const updatedFilteredRoles = filteredRoles.map(role => {
            if (role.id === id) {
                return {
                    ...role,
                    status: role.status === '正常' ? '停用' : '正常'
                };
            }
            return role;
        });
        
        setFilteredRoles(updatedFilteredRoles);
    };

    /**
     * 处理页码切换
     * @param {number} page - 目标页码
     */
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    /**
     * 处理每页显示数量变化
     * @param {Event} e - 事件对象
     */
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // 修改每页数量后重置为第一页
    };

    /**
     * 生成分页器的页码按钮
     * 显示当前页附近的一组页码按钮
     * @returns {Array} 页码按钮JSX数组
     */
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageButtons = 5; // 最多显示5个页码按钮
        
        // 计算起始和结束页码，使当前页尽量居中显示
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        
        // 调整起始页码，确保显示固定数量的页码按钮
        if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        // 生成页码按钮
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <span 
                    key={i} 
                    className={`page-number ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </span>
            );
        }
        
        return pageNumbers;
    };

    return (
        <div className="container">
            {/* 删除确认弹框 */}
            {showDeleteDialog && (
                <div className="delete-dialog-overlay">
                    <div className="delete-dialog">
                        <h3>确认删除</h3>
                        <p>是否确认删除选中的角色？</p>
                        <div className="dialog-buttons">
                            <button className="btn btn-primary" onClick={confirmDelete}>确定</button>
                            <button className="btn btn-secondary" onClick={cancelDelete}>取消</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 搜索和筛选区域 */}
            <div className="search-area">
                <div className="search-inputs">
                    <div className="input-group">
                        <label htmlFor="roleName">角色名称</label>
                        <input type="text" id="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="请输入角色名称" className="search-input" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="permission">权限字符</label>
                        <input type="text" id="permission" value={permission} onChange={(e) => setPermission(e.target.value)} placeholder="请输入权限字符" className="search-input" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="status">状态</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="status-select">
                            <option value="" disabled hidden>角色状态</option>
                            <option value="正常">正常</option>
                            <option value="停用">停用</option>
                        </select>
                    </div>
                    <div className="input-group date-range">
                        <label htmlFor="startDate">创建时间</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
                        <span>-</span>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
                    </div>
                </div>
                <div className="button-group">
                    <button className="btn btn-primary" onClick={handleSearch}>搜索</button>
                    <button className="btn btn-secondary" onClick={handleReset}>重置</button>
                </div>
            </div>

            {/* 操作按钮区域 */}
            <div className="action-area">
                <button className="btn btn-success">新增</button>
                <button className="btn btn-warning">修改</button>
                <button className="btn btn-danger" onClick={() => handleDelete()}>删除</button>
                <button className="btn btn-info">导出</button>
            </div>

            {/* 角色数据表格区域 */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                            <th>角色编号</th>
                            <th>角色名称</th>
                            <th>权限字符</th>
                            <th>显示顺序</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRoles.map(role => (
                            <tr key={role.id}>
                                <td><input type="checkbox" checked={selectedRoles.includes(role.id)} onChange={() => handleSelectRole(role.id)} /></td>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>{role.permission}</td>
                                <td>{role.order}</td>
                                <td>
                                    {/* 状态切换按钮 */}
                                    <div 
                                        className={`switch-button ${role.status === '正常' ? 'active' : ''}`}
                                        onClick={() => toggleRoleStatus(role.id)}
                                        title={`点击${role.status === '正常' ? '停用' : '启用'}该角色`}
                                        style={{ cursor: 'pointer' }}
                                    ></div>
                                </td>
                                <td>{role.created}</td>
                                <td className="operation">
                                    <span className="edit">编辑</span>
                                    <span className="delete" onClick={() => handleDelete()}>删除</span>
                                    <span className="assign">分配</span>
                                    <span className="user">用户</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 分页控制区域 */}
            <div className="pagination">
                <span>共 {filteredRoles.length} 条</span>
                {/* 每页显示数量选择器 */}
                <select className="page-size" value={pageSize} onChange={handlePageSizeChange}>
                    <option value="5">5条/页</option>
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                </select>
                {/* 页码导航 */}
                <div className="page-nav">
                    <button 
                        className="prev" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        上一页
                    </button>
                    {renderPageNumbers()}
                    <button 
                        className="next" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        下一页
                    </button>
                </div>
                <span className="page-info">{currentPage}/{totalPages}页</span>
            </div>
        </div>
    );
}

export default RoleManagement;
