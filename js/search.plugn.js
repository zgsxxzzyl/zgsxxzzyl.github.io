var SearchPlugin = (function(){
    var options = [];
    
    var _bind = function(that){

    }

    var SearchPluginFun = function(config) {
        
    }

    SearchPluginFun.prototype.init = function(config){
        this.input = document.getElementById(config.inputId);
        this.output = document.getElementById(config.outputId);
        _bind(this);
        return this;
    }
  

})();

window.onload = function(){
    new SearchPlugin().init({
        path:path,
        inputId:'local-search-input',
        outputId:'local-search-result'
    });
}