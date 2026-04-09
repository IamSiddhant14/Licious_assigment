import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog">
      <h3 className="confirm-dialog__title">{title}</h3>
      <p className="confirm-dialog__msg">{message}</p>
      <div className="confirm-dialog__actions">
        <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  );
}
