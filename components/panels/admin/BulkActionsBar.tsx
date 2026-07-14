import React from 'react';
import { Eye, EyeOff, Loader2, Trash2, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';

interface BulkActionsBarProps {
  /** Cantidad de elementos seleccionados. */
  count: number;
  /** Si todos los elementos visibles están seleccionados. */
  allSelected: boolean;
  onToggleAll: () => void;
  onClear: () => void;
  busy?: boolean;
  /** Acciones opcionales; se ocultan si no se pasan. */
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
  activateLabel?: string;
  deactivateLabel?: string;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  count,
  allSelected,
  onToggleAll,
  onClear,
  busy = false,
  onActivate,
  onDeactivate,
  onDelete,
  activateLabel = 'Publicar',
  deactivateLabel = 'Ocultar',
}) => {
  const hasSelection = count > 0;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/30 p-3">
      <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium">
        <Checkbox checked={allSelected} indeterminate={hasSelection && !allSelected} onChange={onToggleAll} />
        {hasSelection ? `${count} seleccionado${count === 1 ? '' : 's'}` : 'Seleccionar todo'}
      </label>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {onActivate && (
          <Button size="sm" variant="outline" disabled={!hasSelection || busy} onClick={onActivate}>
            <Eye className="mr-1.5 h-4 w-4" />{activateLabel}
          </Button>
        )}
        {onDeactivate && (
          <Button size="sm" variant="outline" disabled={!hasSelection || busy} onClick={onDeactivate}>
            <EyeOff className="mr-1.5 h-4 w-4" />{deactivateLabel}
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="destructive" disabled={!hasSelection || busy} onClick={onDelete}>
            <Trash2 className="mr-1.5 h-4 w-4" />Eliminar
          </Button>
        )}
        {hasSelection && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={onClear} aria-label="Limpiar selección">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
