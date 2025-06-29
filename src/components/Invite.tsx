import GlassContainer from "./ui/GlassContainer";

const Invite = () => {
  return (
    <div className="flex flex-col items-center">
      <GlassContainer
        variant="default"
        animation="gentleFloat"
        padding="xl"
        className="mx-4"
      >

        <h1 className={`text-3xl text-[var(--header)]`}>
          소중한 분들을 초대합니다.
        </h1>

        <div className="flex flex-row items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
            💌
          </div>
        </div>

        <p className="text-[var(--subtitle)] text-lg" style={{ letterSpacing: 1.05, wordWrap: 'break-word' }}>
          <span className="block">
            수많은 인연 중
          </span>
          <span className="block">
            서로를 알아본 두 사람이
          </span>
          <span className="block">
          사랑으로 결실을 맺습니다.
          </span>
          <span className="block">
            소중한 걸음으로 축복해 주세요.
          </span>
        </p>
      </GlassContainer>
    </div>
  );
};

export default Invite;