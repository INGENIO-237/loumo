export default function generateOtp() {
  return Number(
    Math.floor(Math.random() * 1e5)
      .toString()
      .padStart(5, "0")
  );
}
