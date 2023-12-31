window.onload = function()
{
    // loadSelect();
    getUser();

    // displayRatingStats();
}

function selectControl(request, tag_name)
{
    let table = document.getElementById(tag_name);
    table.innerHTML = request.responseText;
}

function getUser() 
{
    try {
        const req = new XMLHttpRequest();
        req.open("GET", './getUser.php', true);
        req.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                selectControl(req, 'nav-tab');
            }
        }
        req.send(null);
    }catch (exception)
    {
        alert ("Request failed. Please try again.");
    }
}