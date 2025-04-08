// {/* <script> */}
// Three.js Background Animation
function initParticles() {
  const canvas = document.getElementById("particles-bg");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 20;

  // Determine colors based on theme
  const isDarkMode = document.body.classList.contains("dark-mode");
  const particleColor = isDarkMode ? 0x4361ee : 0x3f37c9;

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 500;

  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    sizes[i] = Math.random() * 0.5 + 0.1;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(sizes, 1)
  );

  // Particle material
  const particlesMaterial = new THREE.PointsMaterial({
    color: particleColor,
    size: 0.5,
    transparent: true,
    sizeAttenuation: true,
    opacity: 0.8,
  });

  // Create points mesh
  const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
  );
  scene.add(particles);

  // Animation function
  function animate() {
    requestAnimationFrame(animate);

    // Rotate particles slowly
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;

    // Respond to mouse movement
    const mouseX = (window.mouseX || 0) - window.innerWidth / 2;
    const mouseY = (window.mouseY || 0) - window.innerHeight / 2;
    particles.rotation.x += mouseY * 0.0000005;
    particles.rotation.y += mouseX * 0.0000005;

    renderer.render(scene, camera);
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

  // Track mouse position
  window.addEventListener("mousemove", (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
  });

  animate();
}

// Theme Switch Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("checkbox");

  // Check for saved theme preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.replace("light-mode", "dark-mode");
    themeSwitch.checked = true;
    // Restart particles with new theme colors
    initParticles();
  } else {
    initParticles();
  }

  // Theme switch event
  themeSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.replace("light-mode", "dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.replace("dark-mode", "light-mode");
      localStorage.setItem("theme", "light");
    }
    // Restart particles with new theme colors
    initParticles();
  });
});

// Scroll animations and navigation
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const indicators = document.querySelectorAll(".page-indicator");
  const header = document.querySelector("header");

  // Initialize animation observers
  const sectionTitles = document.querySelectorAll(".section-title");
  const sectionContents = document.querySelectorAll(".section-content");
  const fadeElems = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  sectionTitles.forEach((title) => observer.observe(title));
  sectionContents.forEach((content) => observer.observe(content));
  fadeElems.forEach((elem) => observer.observe(elem));

  // Section scrolling and indicators
  function updatePageIndicators() {
    let currentSection = "";
    let minDist = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const dist = Math.abs(rect.top);

      if (dist < minDist) {
        minDist = dist;
        currentSection = section.id;
      }
    });

    indicators.forEach((indicator) => {
      if (indicator.dataset.section === currentSection) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });

    // Add shadow to header when scrolled
    if (window.scrollY > 10) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }

  // Indicator click behavior
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const sectionId = indicator.dataset.section;
      document.getElementById(sectionId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      document.getElementById(targetId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", updatePageIndicators);
  updatePageIndicators(); // Initial call
});

// Chart.js Implementations
document.addEventListener("DOMContentLoaded", () => {
  const yearlyCtx = document
    .getElementById("yearlyChart")
    .getContext("2d");
  const monthlyCtx = document
    .getElementById("monthlyChart")
    .getContext("2d");

  const langSelect = document.getElementById("langSelect");
  const yearSelect = document.getElementById("yearSelect");
  const relatedTagsContainer = document.getElementById("relatedTags");
  const yearlyLegend = document.getElementById("yearlyLegend");

  let yearlyChart, monthlyChart;
  let rawYearlyData = [];
  let isNormalized = false;

  const normalizeToggle = document.getElementById("normalizeToggle");

  function getChartColors(isDark) {
    return [
      "#4361ee",
      "#3a0ca3",
      "#f72585",
      "#4cc9f0",
      "#4895ef",
      "#560bad",
      "#f3722c",
      "#f8961e",
      "#90be6d",
      "#43aa8b",
      "#577590",
      "#277da1",
      "#ff9e00",
      "#ff0054",
      "#390099",
    ];
  }

  function normalizeData(data) {
    return data.map((tag) => {
      const max = Math.max(...tag.data.map((d) => d.count));
      return {
        label: tag.tag,
        data: tag.data.map((d) => ({
          x: d.year,
          y: +(d.count / max).toFixed(2),
        })),
        borderWidth: 2,
        fill: false,
      };
    });
  }

  function renderYearlyChart() {
    const isDark = document.body.classList.contains("dark-mode");
    const colors = getChartColors(isDark);

    const datasets = isNormalized
      ? normalizeData(rawYearlyData)
      : rawYearlyData.map((tag) => ({
          label: tag.tag,
          data: tag.data.map((d) => ({ x: d.year, y: d.count })),
          borderWidth: 2,
          fill: false,
        }));

    // Apply colors to datasets
    datasets.forEach((dataset, index) => {
      dataset.borderColor = colors[index % colors.length];
      dataset.backgroundColor = colors[index % colors.length] + "33"; // Add alpha for fill
    });

    if (yearlyChart) yearlyChart.destroy();

    yearlyChart = new Chart(yearlyCtx, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          tooltip: {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            titleColor: isDark ? "#fff" : "#333",
            bodyColor: isDark ? "#fff" : "#333",
            borderColor: isDark ? "#333" : "#ddd",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            displayColors: true,
            usePointStyle: true,
            callbacks: {
              title: function (tooltipItems) {
                return `Year: ${tooltipItems[0].parsed.x}`;
              },
            },
          },
          legend: {
            display: false, // We'll use custom legend
          },
        },
        animations: {
          tension: {
            duration: 1000,
            easing: "linear",
          },
        },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Year",
              color: isDark ? "#e9ecef" : "#212529",
            },
            grid: {
              color: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: isDark ? "#e9ecef" : "#212529",
              callback: function (value) {
                return value.toString();
              },
            },
          },
          y: {
            title: {
              display: true,
              text: isNormalized ? "Normalized Count" : "Count",
              color: isDark ? "#e9ecef" : "#212529",
            },
            grid: {
              color: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: isDark ? "#e9ecef" : "#212529",
            },
          },
        },
      },
    });

    // Create custom legend
    renderYearlyLegend(datasets, colors);
  }

  function renderYearlyLegend(datasets, colors) {
    yearlyLegend.innerHTML = "";

    datasets.forEach((dataset, index) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.dataset.index = index;

      const colorBox = document.createElement("div");
      colorBox.className = "legend-color";
      colorBox.style.backgroundColor = colors[index % colors.length];

      const label = document.createElement("span");
      label.textContent = dataset.label;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      yearlyLegend.appendChild(legendItem);

      // Legend item click handler
      legendItem.addEventListener("click", () => {
        const index = parseInt(legendItem.dataset.index);
        const ci = yearlyChart;
        const meta = ci.getDatasetMeta(index);

        // Toggle visibility
        meta.hidden =
          meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        // Toggle class
        legendItem.classList.toggle("faded");

        ci.update();
      });
    });
  }

  function updateMonthlyChart() {
    // Show loader
    document.querySelectorAll(".loader")[1].classList.add("active");

    const lang = langSelect.value;
    const year = yearSelect.value;

    if (!lang || !year) return;

    // Fetch data from backend
    fetch(`http://127.0.0.1:5000/api/monthly-tags?lang=${lang}&year=${year}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        const isDark = document.body.classList.contains("dark-mode");

        // Transform data for Chart.js
        const data = result.data.map((d) => ({ x: d.month, y: d.count }));

        const dataset = {
          label: `${result.tag} - ${result.year}`,
          data,
          borderColor: "#4361ee",
          backgroundColor: "rgba(67, 97, 238, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        };

        if (monthlyChart) monthlyChart.destroy();

        monthlyChart = new Chart(monthlyCtx, {
          type: "line",
          data: { datasets: [dataset] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              tooltip: {
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
                titleColor: isDark ? "#fff" : "#333",
                bodyColor: isDark ? "#fff" : "#333",
                borderColor: isDark ? "#333" : "#ddd",
                borderWidth: 1,
                padding: 10,
                cornerRadius: 6,
              },
            },
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Month",
                  color: isDark ? "#e9ecef" : "#212529",
                },
                grid: {
                  color: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: isDark ? "#e9ecef" : "#212529",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Count",
                  color: isDark ? "#e9ecef" : "#212529",
                },
                grid: {
                  color: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: isDark ? "#e9ecef" : "#212529",
                },
              },
            },
          },
        });

        // Hide loader
        document
          .querySelectorAll(".loader")[1]
          .classList.remove("active");
      })
  }


  function populateSelectors() {
    // Show loader
    document.querySelectorAll(".loader")[0].classList.add("active");

    // Fetch meta information from backend
    fetch("http://127.0.0.1:5000/api/meta")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(({ tags, years }) => {
        // Populate language select
        langSelect.innerHTML = tags
          .map((t) => `<option value="${t}">${t}</option>`)
          .join("");

        // Populate year select
        yearSelect.innerHTML = years
          .map((y) => `<option value="${y}">${y}</option>`)
          .join("");

        // Hide loader
        document
          .querySelectorAll(".loader")[0]
          .classList.remove("active");

        // Initial load of monthly chart
        updateMonthlyChart();
      })
      .catch((error) => {
        console.error("Error fetching meta information:", error);
        // Hide loader and show error message
        document
          .querySelectorAll(".loader")[0]
          .classList.remove("active");
        alert("Failed to load tag information. Please try again later.");
      });
  }

  function fetchYearlyData() {
    // Show loader
    document.querySelectorAll(".loader")[0].classList.add("active");

    // Fetch yearly data from backend
    fetch("http://127.0.0.1:5000/api/yearly-tags")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Store the raw data for normalized/non-normalized toggle
        rawYearlyData = data.map((tag) => ({
          tag: tag.tag,
          data: tag.data.map((d) => ({ year: d.year, count: d.count })),
        }));

        // Hide loader
        document
          .querySelectorAll(".loader")[0]
          .classList.remove("active");

        // Initial chart render
        renderYearlyChart();
      })
      .catch((error) => {
        console.error("Error fetching yearly data:", error);
        // Hide loader and show error message
        document
          .querySelectorAll(".loader")[0]
          .classList.remove("active");
        alert("Failed to load yearly data. Please try again later.");
      });
  }

  // Toggle Normalized View button
  normalizeToggle.addEventListener("click", () => {
    isNormalized = !isNormalized;
    normalizeToggle.textContent = `${
      isNormalized ? "Show Absolute" : "Show Normalized"
    } Values`;
    renderYearlyChart();
  });

  // Selectors event listeners
  langSelect.addEventListener("change", updateMonthlyChart);
  yearSelect.addEventListener("change", updateMonthlyChart);

  // Initialize
  populateSelectors();
  fetchYearlyData();

  // Update charts when theme changes
  document.getElementById("checkbox").addEventListener("change", () => {
    renderYearlyChart();
    updateMonthlyChart();
  });
  
});

// Custom tooltip functionality
document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("tooltip");

  const statCards = document.querySelectorAll(".stat-card");

  statCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const title = card.querySelector(".stat-title").textContent;
      const value = card.querySelector(".stat-number").textContent;

      tooltip.innerHTML = `<strong>${title}</strong>: ${value}`;
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
      tooltip.classList.add("active");
    });

    card.addEventListener("mouseleave", () => {
      tooltip.classList.remove("active");
    });
  });

});


  
  