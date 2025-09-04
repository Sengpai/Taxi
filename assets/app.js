// Chỗ này để sau này bạn muốn gắn tracking click nút gọi, v.v.
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => {
    // ví dụ: gửi event tới Google Analytics / Meta Pixel
    // console.log('Call button clicked');
  });
});
