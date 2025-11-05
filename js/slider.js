const slider = document.querySelector('.style-cards-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // 控制滾動速度
  slider.scrollLeft = scrollLeft - walk;
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.style-cards-container');
    if (container) {
        const items = Array.from(container.children);

        setTimeout(() => {
            container.scrollLeft = container.scrollWidth / 3 + 15;
        }, 100);
        // // 在左邊插入一份複製的內容
        // items.slice().reverse().forEach(item => {
        //     const cloneLeft = item.cloneNode(true);
        //     container.insertBefore(cloneLeft, container.firstChild);
        // });

        // // 在右邊附加一份複製的內容
        // items.forEach(item => {
        //     const cloneRight = item.cloneNode(true);
        //     container.appendChild(cloneRight);
        // });
    }
});
