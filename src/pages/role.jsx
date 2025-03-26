import React, { useState } from 'react';
import './role.scss';

function RoleManagement() {
    const [roleName, setRoleName] = useState('');
    const [permission, setPermission] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [roles, setRoles] = useState([
        { id: 1, name: '超级管理员', permission: 'admin', order: 1, status: '正常', created: '2025-02-24 17:35:49' },
        { id: 2, name: '普通角色', permission: 'common', order: 2, status: '正常', created: '2025-02-24 17:35:49' },
        { id: 3, name: '测试角色', permission: 'test', order: 3, status: '正常', created: '2025-01-24 17:35:49' },
    ]);
    const [filteredRoles, setFilteredRoles] = useState(roles);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const handleSearch = () => {
        const filtered = roles.filter(role => 
            (roleName === '' || role.name.includes(roleName)) &&
            (permission === '' || role.permission.includes(permission)) &&
            (status === '' || role.status === status) &&
            (startDate === '' || new Date(role.created) >= new Date(startDate)) &&
            (endDate === '' || new Date(role.created) <= new Date(endDate))
        );
        setFilteredRoles(filtered);
    };

    const handleReset = () => {
        setRoleName('');
        setPermission('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setFilteredRoles(roles);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        if (newSelectAll) {
            setSelectedRoles(filteredRoles.map(role => role.id));
        } else {
            setSelectedRoles([]);
        }
    };

    const handleSelectRole = (id) => {
        if (selectedRoles.includes(id)) {
            setSelectedRoles(selectedRoles.filter(roleId => roleId !== id));
        } else {
            setSelectedRoles([...selectedRoles, id]);
        }
    };

    const handleDelete = () => {
        if (selectedRoles.length === 0) {
            alert('请选择要删除的角色');
            return;
        }
        setDeleteId(selectedRoles[0]);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        const newRoles = roles.filter(role => !selectedRoles.includes(role.id));
        setRoles(newRoles);
        setFilteredRoles(newRoles);
        setSelectedRoles([]);
        setSelectAll(false);
        setShowDeleteDialog(false);
    };

    return (
        <div className="container">
            {/* 删除确认对话框 */}
            {showDeleteDialog && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>系统提示</h3>
                            <span className="close-btn" onClick={() => setShowDeleteDialog(false)}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="warning-icon">!</div>
                            <p>是否确认删除角色编号为"{deleteId}"的数据项？</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={() => setShowDeleteDialog(false)}>取消</button>
                            <button className="btn btn-primary" onClick={confirmDelete}>确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 搜索和操作区域 */}
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

            {/* 表格区域 */}
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
                        {filteredRoles.map(role => (
                            <tr key={role.id}>
                                <td><input type="checkbox" checked={selectedRoles.includes(role.id)} onChange={() => handleSelectRole(role.id)} /></td>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>{role.permission}</td>
                                <td>{role.order}</td>
                                <td><div className={`switch-button ${role.status === '正常' ? 'active' : ''}`}></div></td>
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

            {/* 分页区域 */}
            <div className="pagination">
                <span>共 {filteredRoles.length} 条</span>
                <select className="page-size">
                    <option value="10">10条/页</option>
                </select>
                <div className="page-nav">
                    <button className="prev">上一页</button>
                    <span className="page-number active">1</span>
                    <button className="next">下一页</button>
                </div>
                <span className="page-info">1页</span>
            </div>
        </div>
    );
}

export default RoleManagement; 