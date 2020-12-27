(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;
  var current_img_blob = "";
  send_request_button = document.getElementById("send-request-button");
  save_button = document.getElementById("save-button");
  preprocessing = document.getElementById("preprocessing");
  postprocessing = document.getElementById("postprocessing");
  model = document.getElementById("model");
  
  function update_save_button() {
    if (current_img_blob == "") {
      save_button.style.display = "none";
    } else {
      save_button.style.display = "block";
    }
  } update_save_button();

  function set_new_image(blob_url) {
    img = document.getElementById("img");
    save_a = document.getElementById("save-a");
    current_img_blob = blob_url;
    img.src = blob_url;
    save_a.href = blob_url;
    save_a.download = 'cropped_image_' + (new Date()).getTime() + '.png';
    update_save_button();
  }

  function send_request(data) {
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
        preprocessing : preprocessing.checked,
        postprocessing : postprocessing.checked,
        model : model.checked ? "u2netp" : "u2net"
      },
      img : img_url
    }
    send_request(config_dict);
    img.src = current_img_blob;
  }

})();
