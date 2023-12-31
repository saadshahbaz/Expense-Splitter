function deleteSession() 
{
    try {
        const req = new XMLHttpRequest();
        req.open("GET", './logout.php', true);
        req.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log( "You have been logged out.");
            }
            else
            {
                console.log("Error logging out.");
            }
        }
        req.send(null);
    }catch (exception)
    {
        alert ("Request failed. Please try again.");
    }
}