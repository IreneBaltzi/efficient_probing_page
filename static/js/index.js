window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener("scroll", function() {
  const stickyBar = document.querySelector(".sticky-bar");

  if (window.scrollY > 300) {
    stickyBar.classList.add("visible");
  } else {
    stickyBar.classList.remove("visible");
  }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    initializeModels();
})
function showParadigm(type) {
  const image = document.getElementById("paradigm-image");
  const text = document.getElementById("paradigm-text");
  const btnGlobal = document.getElementById("btn-global");
  const btnLocal = document.getElementById("btn-local");

  // Fade out
  image.style.opacity = 0;

  setTimeout(() => {
    if (type === "global") {
      image.src = "static/images/global.png";
      text.innerHTML =
        "Global-style pre-training (e.g., CLIP, JEPA) promotes aggregation into a single representation. Evaluation protocols commonly rely on global pooling.";

      btnGlobal.classList.remove("is-light");
      btnGlobal.classList.add("is-dark");
      btnLocal.classList.remove("is-dark");
      btnLocal.classList.add("is-light");

    } else {
      image.src = "static/images/local.png";
      text.innerHTML =
        "Local-style pre-training (e.g., MAE, DINO, iBOT, Diffusion) preserves spatially distributed semantics across patch tokens. Spatial probing can better unlock this structure.";

      btnLocal.classList.remove("is-light");
      btnLocal.classList.add("is-dark");
      btnGlobal.classList.remove("is-dark");
      btnGlobal.classList.add("is-light");
    }

    // Fade back in
    image.style.opacity = 1;

  }, 250);
}

function showProtocol(type) {

  const img = document.getElementById("protocol-image");
  const text = document.getElementById("protocol-text");
  const question = document.getElementById("protocol-question");

  question.style.display = "none";
  question.innerHTML = "";

  const btns = ["btn-knn", "btn-lp", "btn-ft", "btn-ap"];
  btns.forEach(id => {
    const b = document.getElementById(id);
    if (b) {
      b.classList.remove("is-dark", "is-primary");
      b.classList.add("is-light");
    }
  });

  // Fade out first
  img.style.opacity = 0;
  text.style.opacity = 0;

  setTimeout(() => {

    switch(type) {

      case "knn":
        document.getElementById("btn-knn").classList.add("is-dark");
        img.src = "static/images/knn.png";
        text.innerHTML = `
          <p>
            k-NN uses the global image representation for similarity computation.
          </p>
        `;
        break;

      case "lp":
        document.getElementById("btn-lp").classList.add("is-dark");
        img.src = "static/images/lp.png";
        text.innerHTML = `
          <p>
            Linear probing trains a classifier on top of frozen global features.
          </p>
        `;
        break;

      case "ft":
        document.getElementById("btn-ft").classList.add("is-dark");
        img.src = "static/images/ft.png";
        text.innerHTML = `
          <p>
            Fine-tuning updates all parameters while still relying on global representations.
          </p>
        `;
        question.style.display = "block";
        question.innerHTML =
            "Are these protocols suitable for models optimizing local representations?";
        break;

      case "ap":
        document.getElementById("btn-ap").classList.add("is-primary");
        img.src = "static/images/ap.png";
        text.innerHTML = `
          <p>
            If modern pre-training distributes semantics across spatial tokens,
            evaluation should reflect this structure.
            <b>Attentive probing replaces global pooling with attention-based aggregation</b>.
          </p>

          <ul style="text-align:left; max-width:650px; margin:20px auto;">
            <li>Uses spatial token representations instead of a single global token.</li>
            <li>Aggregates information through learnable attention weights.</li>
            <li>Better aligned with locally optimized pre-training objectives.</li>
          </ul>

          <p style="margin-top:20px;">
            While attentive probing has appeared in different forms,
            its design space remains underexplored.
            There is <b>no systematic analysis or direct comparison</b>
            of attentive probing mechanisms.
          </p>
        `;
        break;
    }

    // Fade back in
    img.style.opacity = 1;
    text.style.opacity = 1;

  }, 200);
}

window.addEventListener("DOMContentLoaded", () => {
  showProtocol("ap");
});


const plotData = {

  "MAE": {
    "default": {
      'size': "ViT-B",
      'dataset': "ImageNet-1K"
    },

    "ViT-S": {
      "ImageNet-1K": "static/images/mae_vits_imagenet.png"
    },

    "ViT-B": {
      "ImageNet-1K": "static/images/mae_vitb_imagenet.png",
      "Food-101": "static/images/mae_vitb_food.png",
      "FGVC-Aircraft": "static/images/mae_vitb_aircraft.png",
      "CUB200": "static/images/mae_vitb_cub.png",
      "Places365": "static/images/mae_vitb_places.png",
      "CIFAR-100": "static/images/mae_vitb_cifar.png",
      "Cars-196": "static/images/mae_vitb_cars.png"
    },

    "ViT-L": {
      "ImageNet-1K": "static/images/mae_vitl_imagenet.png"
    }
  },


  "SimMIM": {
    "default": {
      size: "ViT-B",
      dataset: "ImageNet-1K"
    },

    "ViT-B": {
      "ImageNet-1K": "static/images/simmim_vitb_imagenet.png"
    }
  },


  "BEiT-v2": {
    "default": {
      size: "ViT-B",
      dataset: "ImageNet-1K"
    },

    "ViT-B": {
      "ImageNet-1K": "static/images/beitv2_vitb_imagenet.png"
    }
  },


  "CAPI": {
    "default": {
      size: "ViT-L",
      dataset: "ImageNet-1K"
    },

    "ViT-L": {
      "ImageNet-1K": "static/images/capi_vitl_imagenet.png"
    }
  }

};


function initializeModels() {
  const modelSelect = document.getElementById("modelSelect");

  Object.keys(plotData).forEach(model => {
    const option = document.createElement("option");
    option.value = model;
    option.text = model;
    modelSelect.appendChild(option);
  });
}

function updateSizes() {

  const model = document.getElementById("modelSelect").value;
  const sizeSelect = document.getElementById("sizeSelect");
  const datasetSelect = document.getElementById("datasetSelect");
  const img = document.getElementById("accuracyPlot");

  sizeSelect.innerHTML = '<option value="">Select Size</option>';
  datasetSelect.innerHTML = '<option value="">Select Dataset</option>';
  datasetSelect.disabled = true;

  if (!model) return;

  const modelData = plotData[model];

  // Populate sizes (skip "default")
  Object.keys(modelData).forEach(size => {
    if (size === "default") return;

    const option = document.createElement("option");
    option.value = size;
    option.text = size;
    sizeSelect.appendChild(option);
  });

  sizeSelect.disabled = false;

  // ---- AUTO SELECT DEFAULT ----
  if (modelData.default) {

    const defaultSize = modelData.default.size;
    const defaultDataset = modelData.default.dataset;

    sizeSelect.value = defaultSize;

    updateDatasets(); // populate datasets

    datasetSelect.value = defaultDataset;

    const newSrc = modelData[defaultSize][defaultDataset];

    img.classList.add("plot-fade-out");

    setTimeout(() => {
    img.src = newSrc;
    img.style.display = "block";
    img.classList.remove("plot-fade-out");
    }, 300);

    }
}


function updateDatasets() {
  const model = document.getElementById("modelSelect").value;
  const size = document.getElementById("sizeSelect").value;
  const datasetSelect = document.getElementById("datasetSelect");

  datasetSelect.innerHTML = '<option value="">Select Dataset</option>';

  if (!model || !size) return;

  Object.keys(plotData[model][size]).forEach(dataset => {
    const option = document.createElement("option");
    option.value = dataset;
    option.text = dataset;
    datasetSelect.appendChild(option);
  });

  datasetSelect.disabled = false;
}

function updatePlot() {

  const model = document.getElementById("modelSelect").value;
  const size = document.getElementById("sizeSelect").value;
  const dataset = document.getElementById("datasetSelect").value;

  const img = document.getElementById("accuracyPlot");

  if (!(model && size && dataset)) return;

  const newSrc = plotData[model][size][dataset];

  if (img.src.includes(newSrc)) return;

  // 1️⃣ Trigger exit animation
  img.classList.remove("plot-active");
  img.classList.add("plot-exit");

  setTimeout(() => {

    // 2️⃣ Change image
    img.src = newSrc;

    // 3️⃣ Set enter starting state
    img.classList.remove("plot-exit");
    img.classList.add("plot-enter");

    // 4️⃣ Force reflow (IMPORTANT)
    void img.offsetWidth;

    // 5️⃣ Animate to active
    img.classList.remove("plot-enter");
    img.classList.add("plot-active");

  }, 600);
}


function animatePlotsOnScroll() {
  const plot = document.querySelector('.plot-animate');

  if (!plot) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        plot.classList.add('visible');
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(plot);
}

document.addEventListener("DOMContentLoaded", animatePlotsOnScroll);



function typeWriterEffect(element, speed = 1) {
  const text = element.textContent.trim();
  element.textContent = "";
  element.classList.add("typing");

  let i = 0;
  const chunkSize = 3;  // writes 3 characters per frame

  function type() {
    element.textContent += text.slice(i, i + chunkSize);
    i += chunkSize;

    if (i < text.length) {
      setTimeout(type, speed);
    } else {
      element.classList.remove("typing");
    }
  }

  type();
}



function setupScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const abstract = entry.target.querySelector('#abstract-text');
        if (abstract && !abstract.dataset.typed) {
            abstract.dataset.typed = "true";
            setTimeout(() => typeWriterEffect(abstract, 2), 100);
        }
        }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", setupScrollReveal);

