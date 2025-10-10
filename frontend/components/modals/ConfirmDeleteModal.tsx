import Popover from "../Popover";

export default function ConfirmDeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  handleDelete,
  title,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  handleDelete: () => void;
  title: string;
}) {
  return (
    <Popover
      title="Confirmation de suppression"
      visible={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
    >
      <div className="p-8  text-center space-y-4">
        <p className="text-xl ">{title}</p>
        <p className="space-x-5">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
          >
            Non
          </button>
          <button
            onClick={handleDelete}
            className="bg-secondary text-white px-6 py-2 rounded-md cursor-pointer"
          >
            Oui
          </button>
        </p>
      </div>
    </Popover>
  );
}
