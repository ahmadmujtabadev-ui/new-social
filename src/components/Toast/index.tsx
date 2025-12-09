import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#1a1a1a",
  color: "#ffffff",
  iconColor: "#FDB913",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
    // Center the toast horizontally
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.border = "1px solid #333";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 8px 32px rgba(253, 185, 19, 0.15)";
    
    // Style the timer progress bar
    const timerBar = toast.querySelector(".swal2-timer-progress-bar") as HTMLElement;
    if (timerBar) {
      timerBar.style.background = "linear-gradient(90deg, #FDB913 0%, #F59E0B 100%)";
    }
  },
});

export default Toast;