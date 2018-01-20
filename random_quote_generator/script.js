document.write('<script type="text/javascript" src="var.js" ></script>');
    var imported = document.createElement('script');
    imported.src = 'randomColor.js';
    document.head.appendChild(imported);
    
/*      $('blockquote').text(rand);  
      $('.quote').click(function(){
        $('body').css('background-color', randColor);
        $('blockquote').text(quotes[Math.floor( Math.random() * quotes.length )]);
      });
      $('.tweet').click(function(){
        $('.tweet a').attr('href','https://twitter.com/intent/tweet?text='+encodeURIComponent(rand));
*/


function quoter() {

    var rand = quotes[Math.floor( Math.random() * quotes.length )];

    var randColor = randomColor();
    var randButtColor = randomColor();

    // random array number and color generator
    var random = Math.floor((Math.random() * quotes.length));

    // body background colour
    document.body.style.backgroundColor = randColor ;
    $('blockquote').text(rand);  
    //document.getElementById("btt").style.background = randButtColor ;

    //quote generator
    document.getElementsByTagName('blockquote').text = quotes[random];

  }
