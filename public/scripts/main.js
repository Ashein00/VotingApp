$(function () {
  setTimeout(function () {
    $("body").removeClass("loading");
  }, 1000);
});


  function openTab(evt, partyName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    const array = partyName.replace(/[\n\r]/g, '');
    
    var parties = JSON.parse(array);
    
    const checked = document.querySelectorAll('input[type="checkbox"][name="myCheckbox"]:checked');
    
    for(var j =0 ; j<checked.length;j++){
      checked[i].checked = false;
    }
  

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
      
    }
  
    // // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    for(i=0;i<parties.length;i++){
      document.getElementById(parties[i].name).style.display = "block";
      
     
    }

  const maxCheckboxes = 3;

  // Get all the checkboxes
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="myCheckbox"]'
  );

    // Add event listeners to each checkbox
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        // Get the number of currently checked checkboxes
        const checkedCount = document.querySelectorAll('input[type="checkbox"][name="myCheckbox"]:checked').length;
        

        // Check if the maximum limit has been reached
        if (checkedCount > maxCheckboxes) {
          this.checked = false; // Uncheck the current checkbox
        }

      // Disable additional checkboxes if the maximum limit has been reached
      checkboxes.forEach((cb) => {
        cb.disabled = checkedCount >= maxCheckboxes && !cb.checked;
      });
    });
  });

  evt.currentTarget.className += " active";
}

// candidate register site

var current_fs, next_fs, previous_fs;
var left, opacity, scale;
var animating;

$(".next").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this).parent().next();

  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  next_fs.show();

  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        scale = 1 - (1 - now) * 0.2;
        left = now * 50 + "%";
        opacity = 1 - now;
        current_fs.css({
          transform: "scale(" + scale + ")",
          position: "absolute",
        });
        next_fs.css({ left: left, opacity: opacity });
      },
      duration: 500,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      easing: "easeInOutBack",
    }
  );
});

$(".previous").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();

  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");

  previous_fs.show();
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        scale = 0.8 + (1 - now) * 0.2;
        left = (1 - now) * 50 + "%";
        opacity = 1 - now;
        current_fs.css({ left: left });
        previous_fs.css({
          transform: "scale(" + scale + ")",
          opacity: opacity,
        });
      },
      duration: 500,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      easing: "easeInOutBack",
    }
  );
});

// result page
