import { useTenant } from '../tenant.context'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { tenantId } = useTenant()

  return (
    <header className="header">
      <span className="header__title">{title}</span>
      {tenantId !== 'default' && (
        <span className="header__badge">{tenantId} workspace</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600,
        }}>
          JD
        </div>
      </div>
    </header>
  )
}
