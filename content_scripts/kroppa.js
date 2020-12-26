(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  var current_img_blob = "";
  send_request_button = document.getElementById("send-request-button");

  function set_new_image(blob_url)
  {
    img = document.getElementById("img");
    current_img_blob = blob_url;
    img.src = blob_url;
    img.onload = function() {
      var w = img.width;
      var h = img.height;
      
    }
    
  }

  function send_request(data) 
  {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://bruh.uno:5010/cropping-api/crop", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var blob = xhr.response;
          set_new_image(URL.createObjectURL(blob));
        } else {
          console.log('asd');
        }
    };
    xhr.send(JSON.stringify(data));
  }

  send_request_button.onclick = function () {
    img_url = document.getElementById("url").value;
    if (img_url == ""){
      return;
    }

    var config_dict = {
      settings : { 
        is_url : true,
        preprocessing : false,
        postprocessing : true,
        model : "u2netp"
      },
      img : img_url
    }
    send_request(config_dict);
    img.src = current_img_blob;
  }

})();
