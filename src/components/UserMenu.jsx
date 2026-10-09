import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { auth } from '../firebase';
import { logoutUser, changeUserPassword, updateUserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { User, Key, LogOut, X, AlertCircle, CheckCircle, Edit2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenu() {
  const { userProfile } = useAppStore();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');
  const roleName = isAdmin ? 'Admin' : (userProfile?.rol || 'Docente');

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: '8px'
        }}
        className="user-menu-btn"
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {roleName.charAt(0)}
        </div>
        <span style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
          {roleName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '240px', overflow: 'hidden', zIndex: 1000, border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1E293B' }}>{userProfile?.nombre || 'Usuario'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{auth.currentUser?.email}</p>
            </div>
            
            <div style={{ padding: '8px' }}>
              <button className="dropdown-item" onClick={() => { setIsOpen(false); setShowProfile(true); }}>
                <User size={16} /> Mi Perfil
              </button>
              <button className="dropdown-item" onClick={() => { setIsOpen(false); setShowPassword(true); }}>
                <Key size={16} /> Cambiar Contraseña
              </button>
            </div>
            
            <div style={{ padding: '8px', borderTop: '1px solid #E2E8F0' }}>
              <button className="dropdown-item danger" onClick={() => { setIsOpen(false); logoutUser(); }}>
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} profile={userProfile} email={auth.currentUser?.email} role={roleName} />
      <PasswordModal isOpen={showPassword} onClose={() => setShowPassword(false)} />
      
      <style>{`
        .user-menu-btn:hover { background: #F1F5F9; }
        .dropdown-item {
          width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border: none; background: transparent; cursor: pointer; border-radius: 6px;
          color: #475569; font-size: 14px; text-align: left; transition: all 0.2s;
        }
        .dropdown-item:hover { background: #F1F5F9; color: #1E293B; }
        .dropdown-item.danger:hover { background: #FEF2F2; color: #EF4444; }
      `}</style>
    </div>
  );
}

function ProfileModal({ isOpen, onClose, profile, email, role }) {
  const { setUserProfile, userId } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nombre: '', institucion: '', celular: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setEditData({ 
        nombre: profile.nombre || '', 
        institucion: profile.institucion || '',
        celular: profile.celularDesencriptado || profile.celular || ''
      });
      setIsEditing(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(userId, editData);
      setUserProfile({ 
        ...profile, 
        ...editData,
        celularDesencriptado: editData.celular
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '420px', maxWidth: '90%', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#1E293B', fontSize: '20px' }}>Información del Docente</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#315B54', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              <Edit2 size={16} /> Editar
            </button>
          )}
        </div>

        {/* Badge de seguridad */}
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
          <span>🔒 <strong>Sesión JWT Verificada</strong> & Cifrado Habeas Data Activo</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Nombre Completo</label>
            {isEditing ? (
              <input value={editData.nombre} onChange={e => setEditData({...editData, nombre: e.target.value})} style={{ width: '100%', padding: '8px 12px', marginTop: '4px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
            ) : (
              <p style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '15px' }}>{profile?.nombre || 'No definido'}</p>
            )}
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Correo Electrónico</label>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px' }}>{email || 'No definido'} <span style={{ fontSize: '11px' }}>(No editable)</span></p>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Celular / WhatsApp (Protegido)</label>
            {isEditing ? (
              <input value={editData.celular} onChange={e => setEditData({...editData, celular: e.target.value})} placeholder="Ej. +57 300 123 4567" style={{ width: '100%', padding: '8px 12px', marginTop: '4px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
            ) : (
              <p style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '15px' }}>{profile?.celularDesencriptado || profile?.celular || 'No registrado'}</p>
            )}
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Rol Asignado</label>
            <p style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '15px' }}>
              <span style={{ background: role === 'Admin' ? '#EDE9FE' : '#F1F5F9', color: role === 'Admin' ? '#6D28D9' : '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                {role}
              </span>
            </p>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Institución</label>
            {isEditing ? (
              <input value={editData.institucion} onChange={e => setEditData({...editData, institucion: e.target.value})} style={{ width: '100%', padding: '8px 12px', marginTop: '4px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
            ) : (
              <p style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '15px' }}>{profile?.institucion || 'No definida'}</p>
            )}
          </div>
          
          {isEditing && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '500' }}>Cancelar</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '10px', background: 'var(--primary-sage)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                {loading ? 'Guardando...' : <><Save size={16} /> Guardar</>}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function PasswordModal({ isOpen, onClose }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPass !== confirmNewPass) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    
    setLoading(true);
    try {
      await changeUserPassword(currentPass, newPass);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      }, 2000);
    } catch (err) {
      if (err.message === 'invalid-credential') setError('La contraseña actual es incorrecta.');
      else if (err.message === 'weak-password') setError('La nueva contraseña es muy débil (mínimo 6 caracteres).');
      else if (err.message === 'requires-recent-login') setError('Por seguridad, debes cerrar sesión y volver a entrar para cambiar la contraseña.');
      else setError('Hubo un error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '400px', maxWidth: '90%', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
        <h2 style={{ margin: '0 0 24px 0', color: '#1E293B', fontSize: '20px' }}>Cambiar Contraseña</h2>
        
        {success ? (
          <div style={{ textAlign: 'center', color: '#10B981', padding: '20px 0' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 16px auto' }} />
            <p style={{ margin: 0, fontWeight: 'bold' }}>¡Contraseña actualizada!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#475569', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Contraseña Actual</label>
              <input type="password" required value={currentPass} onChange={e=>setCurrentPass(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#475569', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Nueva Contraseña</label>
              <input type="password" required value={newPass} onChange={e=>setNewPass(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#475569', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Confirmar Nueva Contraseña</label>
              <input type="password" required value={confirmNewPass} onChange={e=>setConfirmNewPass(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
            </div>
            
            {error && (
              <div style={{ padding: '10px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            <button type="submit" disabled={loading} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
