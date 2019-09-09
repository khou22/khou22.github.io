// Click main image
function scrollToMain() {
  console.log("Clicked");
  $("html, body").animate(
    {
      scrollTop: $("#mainContent").offset().top - 40
    },
    750
  );
}

// Javascript for blog landing page
$(document).ready(function() {
  // When webpage loads

  $("#site-header").hide(); // Hide header on blog landing page

  $("#blog-landing-portfolio-link").hover(function() {
    // console.log("Hovering");
    var dropdown = document.getElementById("blog-landing-portfolio-dropdown");
    var scrollTop = $(document).scrollTop(); // Distance from top

    // Position
    // 24px will align perfectly
    // Determine if should be on top or bottom
    if (scrollTop < 60) {
      // Arbitrary
      dropdown.style.bottom = "22px"; // Above
      dropdown.style.top = null; // Reset
    } else {
      dropdown.style.top = "22px"; // Below
      dropdown.style.bottom = null; // Reset
    }

    // Display
    dropdown.style.display = "block"; // Show
  });
  $("#blog-landing-portfolio-group").mouseleave(function() {
    // console.log("Mouse left");
    var dropdown = document.getElementById("blog-landing-portfolio-dropdown");
    dropdown.style.display = "none"; // Hide
  });

  // TODO: Duplicate code as for "blog-landing-portfolio-link" --> NEED TO REFACTOR
  $("#blog-landing-blog-link").hover(function() {
    // console.log("Hovering");
    var dropdown = document.getElementById("blog-landing-blog-dropdown");
    var scrollTop = $(document).scrollTop(); // Distance from top

    // Position
    // 24px will align perfectly
    // Determine if should be on top or bottom
    if (scrollTop < 60) {
      // Arbitrary
      dropdown.style.bottom = "22px"; // Above
      dropdown.style.top = null; // Reset
    } else {
      dropdown.style.top = "22px"; // Below
      dropdown.style.bottom = null; // Reset
    }

    // Display
    dropdown.style.display = "block"; // Show
  });
  $("#blog-landing-blog-group").mouseleave(function() {
    // console.log("Mouse left");
    var dropdown = document.getElementById("blog-landing-blog-dropdown");
    dropdown.style.display = "none"; // Hide
  });

  var interpolate = function(section, percentageComplete, classesToChange) {
    for (var i = 0; i < classesToChange.length; i++) {
      // Cycle through all style changes
      var currentClass = classesToChange[i]; // Store
      for (var j = 0; j < currentClass.sections.length; j++) {
        if (currentClass.sections[j] == section) {
          // console.log(percentageComplete); // Feedback
          var dynamicStyle =
            (1 - percentageComplete) * (currentClass.max - currentClass.min) +
            currentClass.min; // Calculate
          if (currentClass.styleElement == "background-color-opacity") {
            // If modifying background color opacity
            $(currentClass.className).css(
              "background-color",
              "rgba(255, 255, 255, " + dynamicStyle + ")"
            ); // Apply
          } else if (currentClass.styleElement == "header-link-color") {
            // If modifying header link color
            // console.log("Modifying header link color");
            var styleString =
              "rgba(" +
              dynamicStyle +
              ", " +
              dynamicStyle +
              ", " +
              dynamicStyle +
              ", 1)";
            // console.log(styleString);
            $(currentClass.className).css("color", styleString); // Apply
          } else {
            $(currentClass.className).css(
              currentClass.styleElement,
              dynamicStyle
            ); // Apply
          }
        }
      }
    }
  };

  // Header is 60px tall
  $(document).scroll(function() {
    var screenWidth = $(document).width();
    var mobileCuttoff = 800; // Ambiguous
    if (screenWidth > mobileCuttoff) {
      var headerHeight = 70;
      var firstSection = $(window).height() - headerHeight;
      var transitionDistance = 50;
      var classesToChange = [
        {
          className: ".blog-landing-header",
          styleElement: "background-color-opacity",
          sections: [2],
          min: 0.8,
          max: 0
        },
        {
          className: ".blog-landing-header",
          styleElement: "background-color-opacity",
          sections: [3],
          min: 0.8,
          max: 0.8
        },
        {
          className: ".blog-landing-header",
          styleElement: "background-color-opacity",
          sections: [1],
          min: 0,
          max: 0
        },
        {
          className: ".blog-landing-header-li a",
          styleElement: "header-link-color",
          sections: [2],
          min: 0,
          max: 255
        },
        {
          className: ".blog-landing-header-li a",
          styleElement: "header-link-color",
          sections: [1],
          min: 255,
          max: 255
        },
        {
          className: ".blog-landing-header-li a",
          styleElement: "header-link-color",
          sections: [3],
          min: 0,
          max: 0
        }
      ];
      if ($(this).scrollTop() < firstSection) {
        // Distance until changing header height
        $("#blog-landing-header").css("position", "absolute");
        var percentageComplete =
          (firstSection - $(this).scrollTop()) / firstSection; // Percentage complete
        interpolate(1, percentageComplete, classesToChange);
        $(".blog-landing-header").css("bottom", 0);
      } else if ($(this).scrollTop() < firstSection + transitionDistance) {
        $("#blog-landing-header").css("position", "fixed");
        $(".blog-landing-header").css("bottom", firstSection);
        var percentageComplete =
          ($(this).scrollTop() - firstSection) / transitionDistance; // Percentage complete
        interpolate(2, percentageComplete, classesToChange);
      } else {
        // Should be pinned at top of screen
        $("#blog-landing-header").css("position", "fixed");
        $(".blog-landing-header").css("bottom", firstSection);
        percentageComplete = 1.0;
        interpolate(3, percentageComplete, classesToChange);
      }

      // Just in case you scroll too fast - max style
      if ($(this).scrollTop() == 0) {
        // Reset all styles
        $("#blog-landing-header").css("position", "absolute");
        for (var i = 0; i < classesToChange.length; i++) {
          var currentClass = classesToChange[i];
          $(currentClass.className).css(
            currentClass.styleElement,
            currentClass.min
          );
        }
      }
    } else {
      // If on mobile
      // console.log("Your screen size does not support dynamic header");
    }
  });
});
