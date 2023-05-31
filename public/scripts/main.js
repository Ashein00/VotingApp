$(function() {
    setTimeout(function(){
      $('body').removeClass('loading');
    }, 1000);
  });
  

  function openTab(evt, partyName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    
    var parties = JSON.parse(partyName);
    
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
    evt.currentTarget.className += " active";
    
  }

