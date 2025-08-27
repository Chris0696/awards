type Props = {
  text: string;
  onClick?: () => void;
};

export default function ColoredOutlineBtn({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 border border-secondary rounded-md cursor-pointer text-secondary hover:bg-secondary hover:text-gray-100 transition-colors"
    >
      {text}
    </button>
  );
}
