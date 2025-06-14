const ConfirmButton = () => {
  return (
    <div className="w-1/2 h-10">
      <button
        type="submit"
        className="btn rounded-full bg-green03 text-green02 border-none flex items-center gap-2 w-full shadow-md"
      >
        {/* <LuBrain className="text-lg" /> */}
        <span className="mr-2">変更を保存</span>
      </button>
    </div>
  )
};

export default ConfirmButton;