function normalizeProfileId(a){return a.trim().toLowerCase()}
document.getElementById("addprofilebtn").addEventListener("click",function(){var a=normalizeProfileId(document.getElementById("profileid").value);window.open("https://www.google.com/maps/search/"+encodeURIComponent(a))});
document.addEventListener("DOMContentLoaded",function(){var a=document.getElementById("accountinfo");a&&(a.textContent="All features are available in this version.")});
