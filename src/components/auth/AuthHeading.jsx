// Big headline of the Login and OTP screens (phones break the line in a different place).
export default function AuthHeading({ isPhone }) {
  return isPhone ? (
    <h1><span>Your next favorite outfit</span><span>is only one click away</span></h1>
  ) : (
    <h1><span>Your next favorite outfit is only</span><span>one click away.</span></h1>
  );
}
