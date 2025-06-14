const AdjustButton = () => {
    return (
        <div className="w-full flex items-center justify-between mx-auto">
            <button
                type="button"
                className="btn flex-1 h-10 shadow-xl rounded-full font-bold text-sm text-white border-none bg-green01"
            // disabled={isSubmitDisabled || submitDataLoading}
            // onClick={saveSubmitShift}
            >
                {/* {reSubmit ? "再提出" : "提出"} */}
                調整する
            </button>
        </div>
    );
};

export default AdjustButton;