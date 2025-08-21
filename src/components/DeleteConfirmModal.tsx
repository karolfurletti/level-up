import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeleteConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  heroName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  heroName
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      data-testid="delete-confirm-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="mb-3">
          Tem certeza que deseja excluir o herói <strong>{heroName}</strong>?
        </p>
        <div className="alert alert-warning mb-0">
          <small>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Esta ação não pode ser desfeita.
          </small>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          data-testid="cancel-delete"
        >
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          data-testid="confirm-delete"
        >
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;


