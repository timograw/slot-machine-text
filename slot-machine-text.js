import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';


// const importUrl = import.meta.url;

// const script = document.createElement('script');
// script.src = new URL('odoo.js', importUrl)
// document.head.appendChild(script);



/**
 * `slot-machine-text`
 * Displays text with a 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SlotMachineText extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        canvas {
          height: 100%;
          width: 100%;
        }
      </style>

      <canvas id="canvas"></canvas> <!--  width="250" height="42" -->
    `;
  }
  static get properties() {
    return {
      /**
       * The message displayed
       */
      text: {
        type: String,
        value: ''
      },
      /**
       * All possible Charactrers
       */
      characters: {
        type: String,
        value: 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789 '
      },
      /**
       * Font size and overall scale
       */
      scale: {
        type: Number,
        value: 25.0
      },
      /**
       * Speed loss per frame
       */
      breaks: {
        type: Number,
        value: 0.003
      },
      /**
       * Speed at which the letter stops
       */
      endSpeed: {
        type: Number,
        value: 0.05
      }
    };
  }

  ready() {
    super.ready();

    var scale = this.scale;
    var breaks = this.breaks;
    var endSpeed = this.endSpeed;  // 
    var firstLetter = 60;  // Number of frames untill the first letter stopps (60 frames per second)
    var delay = 20;  // Number of frames between letters stopping
    var canvas = this.$.canvas;
    var ctx = canvas.getContext('2d');

    var text = this.text.split('');
    var chars = this.characters.split('');
    var charMap = [];
    var offset = [];
    var offsetV = [];

    for(var i=0;i<chars.length;i++){
      charMap[chars[i]] = i;
    }

    for(var i=0;i<text.length;i++){
      var f = firstLetter+delay*i;
      offsetV[i] = endSpeed+this.breaks*f;
      offset[i] = -(1+f)*(this.breaks*f+2*endSpeed)/2;
    }


    (onresize = function(){
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    })();
    var loop;
    requestAnimationFrame( loop = function(){
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      for(var i=0;i<text.length;i++){
        ctx.fillStyle = '#000';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.setTransform(1,0,0,1,Math.floor((canvas.width-scale*(text.length-1))/2),Math.floor(canvas.height/2));
        var o = offset[i];
        while(o<0)o++;
        o %= 1;
        var h = Math.ceil(canvas.height/2/scale)
        for(var j=-h;j<h;j++){
          var c = charMap[text[i]]+j-Math.floor(offset[i]);
          while(c<0)c+=chars.length;
          c %= chars.length;
          var s = 1- Math.abs(j+o)/(canvas.height/2/scale+1)
          ctx.globalAlpha = s
          ctx.font = scale*s + 'px Roboto'
          ctx.fillText(chars[c],scale*i,(j+o)*scale);
        }
        offset[i] += offsetV[i];
        offsetV[i] -= breaks;
        if(offsetV[i]<endSpeed){
          offset[i] = 0;
          offsetV[i] = 0;
        }
      }
      
      requestAnimationFrame(loop);
    });
  }

  attached() {
    
  }
}

window.customElements.define('slot-machine-text', SlotMachineText);

