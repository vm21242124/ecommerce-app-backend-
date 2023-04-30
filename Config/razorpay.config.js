import Razorpay from 'razorpay'
export const instance = new Razorpay({
  key_id: "rzp_test_FtR9vftHulYt3E",
  key_secret:process.env.RAZORPAY_SECRET,
});
