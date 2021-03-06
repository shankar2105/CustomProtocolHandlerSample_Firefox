const { CC, Cc, Ci, Cu, Cm, Cr, components } = require('chrome');
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
const SCHEME = "safe";
const DDG_URI = Services.io.newURI("http://localhost:8080/%s", null, null);
const nsIURI = CC("@mozilla.org/network/simple-uri;1", "nsIURI");

//var binaryData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAACwlJREFUeNrtWmtwE9cVFkyatCHJTAu/mrRpGWwEKbQhCSGPTpg0QFsCtoUsYwJMU6CxoQ0pbSCBgfLwSxCMLL/kJ+AADjQ8TRsKSAZKQyhtwpDYlp9gg2VDkjKddEjLI6ffubsrrVYrWfIDZJIf39y9d1e7e757znfOvSsDERm+zDB8RcBXBPg6sxxuQ7ytxpBorxUwM3Ll41y5r0WuppUh3aNOGs/V3Muuuqd8LjFXZ5yvz63j8YHAN4Ch5ty6SUAqzqWg/xzwHeDOgPvjd5b8hn5PwF0w5H6MpwJVZntdJ/rXAJJxFWS04lw5MBHX33O7EPA14AdAZiIb6DPYD+aAfu0u/H4C7jOoPxMQi7EVMODjxCCGh0Yt4T6FiXnuh5MKm77ZnwhgV/8VjKjvnuGS8Ym5bppe2ESWvPpLCdlnyqOfAHvtXUA8Xv4ArpeN0Bql6tv1QkC6JqmggaYXNVNC9ml65tU99Oi8sivRTsCPcU05Xv7zoAYH9LUE1GC26yi5qEWMTVh+iH70YiHFmtIoJmFNW7QS8CDadLzw2e67uwR2d8bk9OM0NmUTGROtMDyNjBYrjUhaez7aCLgT4/OB98XM2oVgiTYAwc7L40l59WLW4974gJ5cuJ0empEtZn24OZMNVxBVBEzE2GHgP5Ih3Zhx/p3i7jgev6SKRs/OpdhpGTA8Q214VBEQg5cvBS712N0LmgipjSatqqaH5xbR8MRMYbjs7lFHwBAQ8DpevA34wqxTuIQLS54bCt9Iz2e9R4/P3wyDs8SshzD8lhLwdSAZQD6vva6O46DxHlQHYHh+A8UjrT21cIcwOJZdvWvDbwkBvFh5AjgUvEgJd8brCWUsmXNq6Nml79ComTbMeHokht9UAnilZkRrx3VXvMWKFkK91X19w9nV2eV/uvoojZlbLAznWBcGWdb6t0ld9vucgAcwvghti3eG7aoZ1xqrZ7zoo3yF4Wz8lKyT9MTL22B0FsWY0vzj3KIxUtM3BhLRZwQMAhIBp59R2hn29rXx7TuflN9I0x0oX9efpvGL99HIF7JpWMJqHYGzqtpg5wL6fULAeF5/s7IHq9F1+xovSMrnQuasEMbnlh9E+VpAMfGrJZFLWhdprN8UDTDCACvgCTBQmeVgrq7WALh7cmGzcPefpR2jx1I2wuh0rttRxvpe3mjxublR4/LCOyxdhEQvhsC9ePFXYMj7AcbZu5h5zXnJ3Vto6tpTiPNK8ZIxcHdJ5ELP+kic5zr/e1PX0DDUANwPMLgPPCABM3cQRlztdgVnlwqZZBhusn1I41/dR6NmSWltOKe2MN15aPwaGL+aJi/eRvHL/kgjp68TQtknBMDwUSBga2S7MrVBy1fO6ZP+4BTLVH5pqW7Xyek6MxprzqLvTllFj7xop5cL/kqbjn9Kv847Ju4T67/w0btHZAS8UOgeHGeryTLb69pDubXZHizX+86x0clQ9ymZJxHnm8QL8UqNy1jd2dLEMMf59+PWiOOZGX+i7P3NtPH4J1R56jNKtVcL45mcXq0DVu46Vznb4b4Wb5PL1oi3o3y1e9y6f9DTr+ygkTPWywuWrOAvavEngGOcjZuypJJWb6+hsqOXBIqrO+nNE5cpNQcETMsU6NU6oORIpyv/kId+X9mC9babEgQRkcU8q/s020dYtFQIZY81h7Vo8SLGnPm/J18qurqk/BSVHL1IpcLwDipyeQQEAV4PyOxdDShydRwsdnVQ+ZFO2vBOO83f1CQ8wWSroWn2SDygXqRFUcdjvS48QAhWSCJuwKD2GHNGauZOdxVi/QbehxwuNt4HJiAlpw8JUB5aeqSDykBExt42+mVJPSXk1AqYc0Kt3nzHFrE720ymDWfo6d++jVDIFhqg1PVGJdal9iJQOjQ+bei4eQWG/IPnK9ndi/yMZw/olAlwsaeoCOilShAPqlIeyCSw62081ikevuztczTT4SbWB5NCglf01ASodm/Q5+Usl7qTM9+jsalYy+PllB2cWFP6ZwiT/TGm9J8AhiHPLjFYdzcYyo99vKNIM/NqDwjQAItGAyzd1AA8oEL9MCbB4YQ3YDY2g4icA+20aGsLJeczEQiLnNquQ0ImijOCBeXvhBWHacyc4huYpRM//EV+8rgFWwc8vmCL4dHULYaJiyoM6/c1QYsuhiagzzTA6bF6DVcRUCgLUPnRToGsqvPQh0YRDnEbaqSw0NnENGv6TABXgqbsM9cnrnRtjl9/+tuzStsNKJIM5sJmw+u7OgwOVydPhCDA4fT4aQAfV8gawCHAMMphFASREeBweRaKWHMyVMxzXz4WYQESeGzVrlaaU9pI8SCBQ0Nv3z7g+51dyhS8EJpe2PQBQoaX04P509iktR8abAfaDfC4HVLMq+Pf4xNBe7VGA3rJA8D4M8Fczw8wvlQmIu9gO7224yzNKHTT1OwaoQ+WyEvmQyAgOc5Wa/hNRTMmomO7lPpCaEAfEfAtoCEsEmRwpihDxsg+cIEWbmlGupTDwq7/JdesqxXCey6DvG2WvLrR9r94tpW4Or4IRkCK3eVfCepmAjEWMQEDgJccERDAocKzxUSUoLVCH+aVNRBmU6TNrvcEa31fddHiN2fT9rZdKg1IgzdBBGE8YwgeVB2JFygoEURIYrVydyvNctQLIqYpKTKMjVHWkpW7z4k6JHgd0EcagNhWMAZwKzMcGp6AsRJRSKn0oUAqqxPDKKv5ulVMgNYD+N7VvkowRrsW0N8n7DYB7Anj8OD67niCOmMwETaU1RA3YSCLpFmzoWLO9bXxOUxAq44HqEVQqwHWXvcAJRyMYN4Fl77eEyJEaGBGM/a1IW02iHWFjwj/0JA8oFUQ5zf78nFFHxdCWgK4KLkP9UEOxj7x5mOnCi4uVnx9h/YaPi+3ZUfhFWiX72ylmUibJrmsNms0QAoBqRDSPkNbCKkNNqrWGL1JgNx64nF8vKgn3uCUvIHXF7nQh99tQzEkl9UmOWP4e4BHPw0GE8Fe1gAtATw+BFiGsbpAEVS3nhAiKZ3nJTcT8cafUVZvbuR/eAkipqKGUDxA+xs+1teAoDrQ6wQo449gvBD4V09FctOxiyJrrNnTRnNRPzyf/RGt2HnOXwO0abCvCqEICFDGpqDdo8S4nzZ0BZcvtktlIgoOt9Pit1oos6qNpP0Ajwa+UjjmJopgKAK4HQzMwbl/etXaGQZ09EEqqzvFCtQ36/5ecDPrgHAJkI6dnhi0K9F+Gui62lajE8o5p5Qlir3XqFejsge8y2kwekJATQC3d6Adi3ZjUZDFTE/x5i2oAyIhQGnvBX6O47+p6wDvzLt04OzivGpX2LcnmBW1BCi4D5gNV24MqOtVwhYQ706P5rwnsA5A/DPU3xSMmha4cKsJUJbYD0DtrT1Nmz4CwtEA0T8XDQRIkK59DO0u3PPfoarFXtKAK8DeaCNAtLgmCff9O/Df8Gfffz/AjwD9z+RujC+IVgL4+G5gqSirNRuvofRBby1g1PeA/dCCEdFMgIKRclndHnYa7HpT9HMgyZhkHdAfCJDGXJ5J8veAa12KYNeF0FtGi3UgCDD0JwL4+B5gFvrHQ2lAqLUADD85wmIdBhgY/Y0ApT8U7WvABW12CL4WEH+ccoGAhxTj+zMB3mU3jgvUZbWUBgP3BGG4DQQ8aFQZfzsQwMeD0E4CDhc7O8ViKEX1FxkYfAowAXeDAMPtSIByzF+t5lacuNwip8FLwDIYfD8bLRl+exPAGFjx7uXRKTbXUsz+U/CCOxTje4WALyP+D/G9qpL3dnRXAAAAAElFTkSuQmCC";//"<html><body>HI</body></body></html>";
function SafeProtocolHandler() {
}
SafeProtocolHandler.prototype = Object.freeze({
  classDescription: "Safe Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=" + SCHEME,
  classID: components.ID('{7c3311a6-3a2d-4090-9c26-e83c32e7870c}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler]),
  scheme: SCHEME,
  defaultPort: -1,
  allowPort: function (port, scheme) {
    // This protocol handler does not support ports.
    return false;
  },
  protocolFlags: Ci.nsIProtocolHandler.URI_NOAUTH | Ci.nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,
  newURI: function (aSpec, aOriginCharset, aBaseURI) {
    if (aBaseURI && aBaseURI.scheme == SCHEME) {
      return Services.io.newURI(aSpec, aOriginCharset, DDG_URI);
    }
    let rv = new nsIURI();
    rv.spec = aSpec;
    return rv;
  },
  newChannel: function (aURI) {
    //let spec = DDG_URI.spec.replace("%s", aURI.path);
    //let channel = Services.io.newChannel(spec, aURI.originCharset, null);
    //channel.originalURI = aURI;
    //return channel;
    var channel = new PipeChannel(aURI);
    //channel.setContentType('image/png');
    var result = channel.QueryInterface(Ci.nsIChannel);
    
    //console.log('channel: ', result.inputStreamChannel);
    return result;
  }
});

var PipeChannel = function (URI) {
  this.pipe = Cc["@mozilla.org/pipe;1"].createInstance(Ci.nsIPipe);
  this.pipe.init(true, true, 0, 0, null);
  this.inputStreamChannel = Cc["@mozilla.org/network/input-stream-channel;1"].createInstance(Ci.nsIInputStreamChannel);
  this.inputStreamChannel.setURI(URI);
  this.inputStreamChannel.contentStream = this.pipe.inputStream;
  this.request = this.inputStreamChannel.QueryInterface(Ci.nsIRequest);
  this.channel = this.inputStreamChannel.QueryInterface(Ci.nsIChannel);
};

PipeChannel.prototype = {
  QueryInterface: function (iid) {
    if (iid.equals(Ci.nsIChannel) || iid.equals(Ci.nsIRequest) || iid.equals(Ci.nsISupports))
      return this;
    throw Cr.NS_NOINTERFACE;
  },
  
  get LOAD_NORMAL() {
    return this.request.LOAD_NORMAL
  },
  get LOAD_BACKGROUND() {
    return this.request.LOAD_BACKGROUND
  },
  get INHIBIT_CACHING() {
    return this.request.INHIBIT_CACHING
  },
  get INHIBIT_PERSISTENT_CACHING() {
    return this.request.INHIBIT_PERSISTENT_CACHING
  },
  get LOAD_BYPASS_CACHE() {
    return this.request.LOAD_BYPASS_CACHE
  },
  get LOAD_FROM_CACHE() {
    return this.request.LOAD_FROM_CACHE
  },
  get VALIDATE_ALWAYS() {
    return this.request.VALIDATE_ALWAYS
  },
  get VALIDATE_NEVER() {
    return this.request.VALIDATE_NEVER
  },
  get VALIDATE_ONCE_PER_SESSION() {
    return this.request.VALIDATE_ONCE_PER_SESSION
  },
  
  get loadFlags() {
    return this.request.loadFlags
  },
  set loadFlags(val) {
    this.request.loadFlags = val
  },
  get loadGroup() {
    return this.request.loadGroup
  },
  set loadGroup(val) {
    this.request.loadGroup = val
  },
  get name() {
    return this.request.name
  },
  get status() {
    return this.request.status
  },
  
  cancel: function (status) {
    this.request.cancel(status);
  },
  isPending: function () {
    return this.request.isPending();
  },
  resume: function () {
    this.request.resume();
  },
  suspend: function () {
    this.request.suspend();
  },
  
  get LOAD_DOCUMENT_URI() {
    return this.channel.LOAD_DOCUMENT_URI
  },
  get LOAD_RETARGETED_DOCUMENT_URI() {
    return this.channel.LOAD_RETARGETED_DOCUMENT_URI
  },
  get LOAD_REPLACE() {
    return this.channel.LOAD_REPLACE
  },
  get LOAD_INITIAL_DOCUMENT_URI() {
    return this.channel.LOAD_INITIAL_DOCUMENT_URI
  },
  get LOAD_TARGETED() {
    return this.channel.LOAD_TARGETED
  },
  
  get contentCharset() {
    return this.channel.contentCharset
  },
  set contentCharset(val) {
    this.channel.contentCharset = val
  },
  get contentLength() {
    return this.channel.contentLength
  },
  set contentLength(val) {
    this.channel.contentLength = val
  },
  get contentType() {
    return this.channel.contentType;
  },
  set contentType(val) {
    this.channel.contentType = val;
  },
  get notificationCallbacks() {
    return this.channel.notificationCallbacks
  },
  set notificationCallbacks(val) {
    this.channel.notificationCallbacks = val
  },
  get originalURI() {
    return this.channel.originalURI
  },
  set originalURI(val) {
    this.channel.originalURI = val
  },
  get owner() {
    return this.channel.owner
  },
  set owner(val) {
    this.channel.owner = val
  },
  get securityInfo() {
    return this.channel.securityInfo
  },
  get URI() {
    return this.channel.URI
  },
  
  asyncOpen: function (listener, context) {
    this.channel.asyncOpen(listener, context);
    this.channel.contentType = 'image/png';
    try {
      if (false/* some reason to abort */) {
        this.request.cancel(Cr.NS_BINDING_FAILED);
        Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService).alert(null, 'Error message.', 'Error message.');
        return;
      }
      //result = binaryData;
      var buff = [-119, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 64, 0, 0, 0, 64, 8, 6, 0, 0, 0, -86, 105, 113, -34, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 11, 19, 0, 0, 11, 19, 1, 0, -102, -100, 24, 0, 0, 10, 79, 105, 67, 67, 80, 80, 104, 111, 116, 111, 115, 104, 111, 112, 32, 73, 67, 67, 32, 112, 114, 111, 102, 105, 108, 101, 0, 0, 120, -38, -99, 83, 103, 84, 83, -23, 22, 61, -9, -34, -12, 66, 75, -120, -128, -108, 75, 111, 82, 21, 8, 32, 82, 66, -117, -128, 20, -111, 38, 42, 33, 9, 16, 74, -120, 33, -95, -39, 21, 81, -63, 17, 69, 69, 4, 27, -56, -96, -120, 3, -114, -114, -128, -116, 21, 81, 44, 12, -118, 10, -40, 7, -28, 33, -94, -114, -125, -93, -120, -118, -54, -5, -31, 123, -93, 107, -42, -68, -9, -26, -51, -2, -75, -41, 62, -25, -84, -13, -99, -77, -49, 7, -64, 8, 12, -106, 72, 51, 81, 53, -128, 12, -87, 66, 30, 17, -32, -125, -57, -60, -58, -31, -28, 46, 64, -127, 10, 36, 112, 0, 16, 8, -77, 100, 33, 115, -3, 35, 1, 0, -8, 126, 60, 60, 43, 34, -64, 7, -66, 0, 1, 120, -45, 11, 8, 0, -64, 77, -101, -64, 48, 28, -121, -1, 15, -22, 66, -103, 92, 1, -128, -124, 1, -64, 116, -111, 56, 75, 8, -128, 20, 0, 64, 122, -114, 66, -90, 0, 64, 70, 1, -128, -99, -104, 38, 83, 0, -96, 4, 0, 96, -53, 99, 98, -29, 0, 80, 45, 0, 96, 39, 127, -26, -45, 0, -128, -99, -8, -103, 123, 1, 0, 91, -108, 33, 21, 1, -96, -111, 0, 32, 19, 101, -120, 68, 0, 104, 59, 0, -84, -49, 86, -118, 69, 0, 88, 48, 0, 20, 102, 75, -60, 57, 0, -40, 45, 0, 48, 73, 87, 102, 72, 0, -80, -73, 0, -64, -50, 16, 11, -78, 0, 8, 12, 0, 48, 81, -120, -123, 41, 0, 4, 123, 0, 96, -56, 35, 35, 120, 0, -124, -103, 0, 20, 70, -14, 87, 60, -15, 43, -82, 16, -25, 42, 0, 0, 120, -103, -78, 60, -71, 36, 57, 69, -127, 91, 8, 45, 113, 7, 87, 87, 46, 30, 40, -50, 73, 23, 43, 20, 54, 97, 2, 97, -102, 64, 46, -62, 121, -103, 25, 50, -127, 52, 15, -32, -13, -52, 0, 0, -96, -111, 21, 17, -32, -125, -13, -3, 120, -50, 14, -82, -50, -50, 54, -114, -74, 14, 95, 45, -22, -65, 6, -1, 34, 98, 98, -29, -2, -27, -49, -85, 112, 64, 0, 0, -31, 116, 126, -47, -2, 44, 47, -77, 26, -128, 59, 6, -128, 109, -2, -94, 37, -18, 4, 104, 94, 11, -96, 117, -9, -117, 102, -78, 15, 64, -75, 0, -96, -23, -38, 87, -13, 112, -8, 126, 60, 60, 69, -95, -112, -71, -39, -39, -27, -28, -28, -40, 74, -60, 66, 91, 97, -54, 87, 125, -2, 103, -62, 95, -64, 87, -3, 108, -7, 126, 60, -4, -9, -11, -32, -66, -30, 36, -127, 50, 93, -127, 71, 4, -8, -32, -62, -52, -12, 76, -91, 28, -49, -110, 9, -124, 98, -36, -26, -113, 71, -4, -73, 11, -1, -4, 29, -45, 34, -60, 73, 98, -71, 88, 42, 20, -29, 81, 18, 113, -114, 68, -102, -116, -13, 50, -91, 34, -119, 66, -110, 41, -59, 37, -46, -1, 100, -30, -33, 44, -5, 3, 62, -33, 53, 0, -80, 106, 62, 1, 123, -111, 45, -88, 93, 99, 3, -10, 75, 39, 16, 88, 116, -64, -30, -9, 0, 0, -14, -69, 111, -63, -44, 40, 8, 3, -128, 104, -125, -31, -49, 119, -1, -17, 63, -3, 71, -96, 37, 0, -128, 102, 73, -110, 113, 0, 0, 94, 68, 36, 46, 84, -54, -77, 63, -57, 8, 0, 0, 68, -96, -127, 42, -80, 65, 27, -12, -63, 24, 44, -64, 6, 28, -63, 5, -36, -63, 11, -4, 96, 54, -124, 66, 36, -60, -62, 66, 16, 66, 10, 100, -128, 28, 114, 96, 41, -84, -126, 66, 40, -122, -51, -80, 29, 42, 96, 47, -44, 64, 29, 52, -64, 81, 104, -122, -109, 112, 14, 46, -62, 85, -72, 14, 61, 112, 15, -6, 97, 8, -98, -63, 40, -68, -127, 9, 4, 65, -56, 8, 19, 97, 33, -38, -120, 1, 98, -118, 88, 35, -114, 8, 23, -103, -123, -8, 33, -63, 72, 4, 18, -117, 36, 32, -55, -120, 20, 81, 34, 75, -111, 53, 72, 49, 82, -118, 84, 32, 85, 72, 29, -14, 61, 114, 2, 57, -121, 92, 70, -70, -111, 59, -56, 0, 50, -126, -4, -122, -68, 71, 49, -108, -127, -78, 81, 61, -44, 12, -75, 67, -71, -88, 55, 26, -124, 70, -94, 11, -48, 100, 116, 49, -102, -113, 22, -96, -101, -48, 114, -76, 26, 61, -116, 54, -95, -25, -48, -85, 104, 15, -38, -113, 62, 67, -57, 48, -64, -24, 24, 7, 51, -60, 108, 48, 46, -58, -61, 66, -79, 56, 44, 9, -109, 99, -53, -79, 34, -84, 12, -85, -58, 26, -80, 86, -84, 3, -69, -119, -11, 99, -49, -79, 119, 4, 18, -127, 69, -64, 9, 54, 4, 119, 66, 32, 97, 30, 65, 72, 88, 76, 88, 78, -40, 72, -88, 32, 28, 36, 52, 17, -38, 9, 55, 9, 3, -124, 81, -62, 39, 34, -109, -88, 75, -76, 38, -70, 17, -7, -60, 24, 98, 50, 49, -121, 88, 72, 44, 35, -42, 18, -113, 19, 47, 16, 123, -120, 67, -60, 55, 36, 18, -119, 67, 50, 39, -71, -112, 2, 73, -79, -92, 84, -46, 18, -46, 70, -46, 110, 82, 35, -23, 44, -87, -101, 52, 72, 26, 35, -109, -55, -38, 100, 107, -78, 7, 57, -108, 44, 32, 43, -56, -123, -28, -99, -28, -61, -28, 51, -28, 27, -28, 33, -14, 91, 10, -99, 98, 64, 113, -92, -8, 83, -30, 40, 82, -54, 106, 74, 25, -27, 16, -27, 52, -27, 6, 101, -104, 50, 65, 85, -93, -102, 82, -35, -88, -95, 84, 17, 53, -113, 90, 66, -83, -95, -74, 82, -81, 81, -121, -88, 19, 52, 117, -102, 57, -51, -125, 22, 73, 75, -91, -83, -94, -107, -45, 26, 104, 23, 104, -9, 105, -81, -24, 116, -70, 17, -35, -107, 30, 78, -105, -48, 87, -46, -53, -23, 71, -24, -105, -24, 3, -12, 119, 12, 13, -122, 21, -125, -57, -120, 103, 40, 25, -101, 24, 7, 24, 103, 25, 119, 24, -81, -104, 76, -90, 25, -45, -117, 25, -57, 84, 48, 55, 49, -21, -104, -25, -103, 15, -103, 111, 85, 88, 42, -74, 42, 124, 21, -111, -54, 10, -107, 74, -107, 38, -107, 27, 42, 47, 84, -87, -86, -90, -86, -34, -86, 11, 85, -13, 85, -53, 84, -113, -87, 94, 83, 125, -82, 70, 85, 51, 83, -29, -87, 9, -44, -106, -85, 85, -86, -99, 80, -21, 83, 27, 83, 103, -87, 59, -88, -121, -86, 103, -88, 111, 84, 63, -92, 126, 89, -3, -119, 6, 89, -61, 76, -61, 79, 67, -92, 81, -96, -79, 95, -29, -68, -58, 32, 11, 99, 25, -77, 120, 44, 33, 107, 13, -85, -122, 117, -127, 53, -60, 38, -79, -51, -39, 124, 118, 42, -69, -104, -3, 29, -69, -117, 61, -86, -87, -95, 57, 67, 51, 74, 51, 87, -77, 82, -13, -108, 102, 63, 7, -29, -104, 113, -8, -100, 116, 78, 9, -25, 40, -89, -105, -13, 126, -118, -34, 20, -17, 41, -30, 41, 27, -90, 52, 76, -71, 49, 101, 92, 107, -86, -106, -105, -106, 88, -85, 72, -85, 81, -85, 71, -21, -67, 54, -82, -19, -89, -99, -90, -67, 69, -69, 89, -5, -127, 14, 65, -57, 74, 39, 92, 39, 71, 103, -113, -50, 5, -99, -25, 83, -39, 83, -35, -89, 10, -89, 22, 77, 61, 58, -11, -82, 46, -86, 107, -91, 27, -95, -69, 68, 119, -65, 110, -89, -18, -104, -98, -66, 94, -128, -98, 76, 111, -89, -34, 121, -67, -25, -6, 28, 125, 47, -3, 84, -3, 109, -6, -89, -11, 71, 12, 88, 6, -77, 12, 36, 6, -37, 12, -50, 24, 60, -59, 53, 113, 111, 60, 29, 47, -57, -37, -15, 81, 67, 93, -61, 64, 67, -91, 97, -107, 97, -105, -31, -124, -111, -71, -47, 60, -93, -43, 70, -115, 70, 15, -116, 105, -58, 92, -29, 36, -29, 109, -58, 109, -58, -93, 38, 6, 38, 33, 38, 75, 77, -22, 77, -18, -102, 82, 77, -71, -90, 41, -90, 59, 76, 59, 76, -57, -51, -52, -51, -94, -51, -42, -103, 53, -101, 61, 49, -41, 50, -25, -101, -25, -101, -41, -101, -33, -73, 96, 90, 120, 90, 44, -74, -88, -74, -72, 101, 73, -78, -28, 90, -90, 89, -18, -74, -68, 110, -123, 90, 57, 89, -91, 88, 85, 90, 93, -77, 70, -83, -99, -83, 37, -42, -69, -83, -69, -89, 17, -89, -71, 78, -109, 78, -85, -98, -42, 103, -61, -80, -15, -74, -55, -74, -87, -73, 25, -80, -27, -40, 6, -37, -82, -74, 109, -74, 125, 97, 103, 98, 23, 103, -73, -59, -82, -61, -18, -109, -67, -109, 125, -70, 125, -115, -3, 61, 7, 13, -121, -39, 14, -85, 29, 90, 29, 126, 115, -76, 114, 20, 58, 86, 58, -34, -102, -50, -100, -18, 63, 125, -59, -12, -106, -23, 47, 103, 88, -49, 16, -49, -40, 51, -29, -74, 19, -53, 41, -60, 105, -99, 83, -101, -45, 71, 103, 23, 103, -71, 115, -125, -13, -120, -117, -119, 75, -126, -53, 46, -105, 62, 46, -101, 27, -58, -35, -56, -67, -28, 74, 116, -11, 113, 93, -31, 122, -46, -11, -99, -101, -77, -101, -62, -19, -88, -37, -81, -18, 54, -18, 105, -18, -121, -36, -97, -52, 52, -97, 41, -98, 89, 51, 115, -48, -61, -56, 67, -32, 81, -27, -47, 63, 11, -97, -107, 48, 107, -33, -84, 126, 79, 67, 79, -127, 103, -75, -25, 35, 47, 99, 47, -111, 87, -83, -41, -80, -73, -91, 119, -86, -9, 97, -17, 23, 62, -10, 62, 114, -97, -29, 62, -29, 60, 55, -34, 50, -34, 89, 95, -52, 55, -64, -73, -56, -73, -53, 79, -61, 111, -98, 95, -123, -33, 67, 127, 35, -1, 100, -1, 122, -1, -47, 0, -89, -128, 37, 1, 103, 3, -119, -127, 65, -127, 91, 2, -5, -8, 122, 124, 33, -65, -114, 63, 58, -37, 101, -10, -78, -39, -19, 65, -116, -96, -71, 65, 21, 65, -113, -126, -83, -126, -27, -63, -83, 33, 104, -56, -20, -112, -83, 33, -9, -25, -104, -50, -111, -50, 105, 14, -123, 80, 126, -24, -42, -48, 7, 97, -26, 97, -117, -61, 126, 12, 39, -123, -121, -123, 87, -122, 63, -114, 112, -120, 88, 26, -47, 49, -105, 53, 119, -47, -36, 67, 115, -33, 68, -6, 68, -106, 68, -34, -101, 103, 49, 79, 57, -81, 45, 74, 53, 42, 62, -86, 46, 106, 60, -38, 55, -70, 52, -70, 63, -58, 46, 102, 89, -52, -43, 88, -99, 88, 73, 108, 75, 28, 57, 46, 42, -82, 54, 110, 108, -66, -33, -4, -19, -13, -121, -30, -99, -30, 11, -29, 123, 23, -104, 47, -56, 93, 112, 121, -95, -50, -62, -12, -123, -89, 22, -87, 46, 18, 44, 58, -106, 64, 76, -120, 78, 56, -108, -16, 65, 16, 42, -88, 22, -116, 37, -14, 19, 119, 37, -114, 10, 121, -62, 29, -62, 103, 34, 47, -47, 54, -47, -120, -40, 67, 92, 42, 30, 78, -14, 72, 42, 77, 122, -110, -20, -111, -68, 53, 121, 36, -59, 51, -91, 44, -27, -71, -124, 39, -87, -112, -68, 76, 13, 76, -35, -101, 58, -98, 22, -102, 118, 32, 109, 50, 61, 58, -67, 49, -125, -110, -111, -112, 113, 66, -86, 33, 77, -109, -74, 103, -22, 103, -26, 102, 118, -53, -84, 101, -123, -78, -2, -59, 110, -117, -73, 47, 30, -107, 7, -55, 107, -77, -112, -84, 5, 89, 45, 10, -74, 66, -90, -24, 84, 90, 40, -41, 42, 7, -78, 103, 101, 87, 102, -65, -51, -119, -54, 57, -106, -85, -98, 43, -51, -19, -52, -77, -54, -37, -112, 55, -100, -17, -97, -1, -19, 18, -62, 18, -31, -110, -74, -91, -122, 75, 87, 45, 29, 88, -26, -67, -84, 106, 57, -78, 60, 113, 121, -37, 10, -29, 21, 5, 43, -122, 86, 6, -84, 60, -72, -118, -74, 42, 109, -43, 79, -85, -19, 87, -105, -82, 126, -67, 38, 122, 77, 107, -127, 94, -63, -54, -126, -63, -75, 1, 107, -21, 11, 85, 10, -27, -123, 125, -21, -36, -41, -19, 93, 79, 88, 47, 89, -33, -75, 97, -6, -122, -99, 27, 62, 21, -119, -118, -82, 20, -37, 23, -105, 21, 127, -40, 40, -36, 120, -27, 27, -121, 111, -54, -65, -103, -36, -108, -76, -87, -85, -60, -71, 100, -49, 102, -46, 102, -23, -26, -34, 45, -98, 91, 14, -106, -86, -105, -26, -105, 14, 110, 13, -39, -38, -76, 13, -33, 86, -76, -19, -11, -10, 69, -37, 47, -105, -51, 40, -37, -69, -125, -74, 67, -71, -93, -65, 60, -72, -68, 101, -89, -55, -50, -51, 59, 63, 84, -92, 84, -12, 84, -6, 84, 54, -18, -46, -35, -75, 97, -41, -8, 110, -47, -18, 27, 123, -68, -10, 52, -20, -43, -37, 91, -68, -9, -3, 62, -55, -66, -37, 85, 1, 85, 77, -43, 102, -43, 101, -5, 73, -5, -77, -9, 63, -82, -119, -86, -23, -8, -106, -5, 109, 93, -83, 78, 109, 113, -19, -57, 3, -46, 3, -3, 7, 35, 14, -74, -41, -71, -44, -43, 29, -46, 61, 84, 82, -113, -42, 43, -21, 71, 14, -57, 31, -66, -2, -99, -17, 119, 45, 13, 54, 13, 85, -115, -100, -58, -30, 35, 112, 68, 121, -28, -23, -9, 9, -33, -9, 30, 13, 58, -38, 118, -116, 123, -84, -31, 7, -45, 31, 118, 29, 103, 29, 47, 106, 66, -102, -14, -102, 70, -101, 83, -102, -5, 91, 98, 91, -70, 79, -52, 62, -47, -42, -22, -34, 122, -4, 71, -37, 31, 15, -100, 52, 60, 89, 121, 74, -13, 84, -55, 105, -38, -23, -126, -45, -109, 103, -14, -49, -116, -99, -107, -99, 125, 126, 46, -7, -36, 96, -37, -94, -74, 123, -25, 99, -50, -33, 106, 15, 111, -17, -70, 16, 116, -31, -46, 69, -1, -117, -25, 59, -68, 59, -50, 92, -14, -72, 116, -14, -78, -37, -27, 19, 87, -72, 87, -102, -81, 58, 95, 109, -22, 116, -22, 60, -2, -109, -45, 79, -57, -69, -100, -69, -102, -82, -71, 92, 107, -71, -18, 122, -67, -75, 123, 102, -9, -23, 27, -98, 55, -50, -35, -12, -67, 121, -15, 22, -1, -42, -43, -98, 57, 61, -35, -67, -13, 122, 111, -9, -59, -9, -11, -33, 22, -35, 126, 114, 39, -3, -50, -53, -69, -39, 119, 39, -18, -83, -68, 79, -68, 95, -12, 64, -19, 65, -39, 67, -35, -121, -43, 63, 91, -2, -36, -40, -17, -36, 127, 106, -64, 119, -96, -13, -47, -36, 71, -9, 6, -123, -125, -49, -2, -111, -11, -113, 15, 67, 5, -113, -103, -113, -53, -122, 13, -122, -21, -98, 56, 62, 57, 57, -30, 63, 114, -3, -23, -4, -89, 67, -49, 100, -49, 38, -98, 23, -2, -94, -2, -53, -82, 23, 22, 47, 126, -8, -43, -21, -41, -50, -47, -104, -47, -95, -105, -14, -105, -109, -65, 109, 124, -91, -3, -22, -64, -21, 25, -81, -37, -58, -62, -58, 30, -66, -55, 120, 51, 49, 94, -12, 86, -5, -19, -63, 119, -36, 119, 29, -17, -93, -33, 15, 79, -28, 124, 32, 127, 40, -1, 104, -7, -79, -11, 83, -48, -89, -5, -109, 25, -109, -109, -1, 4, 3, -104, -13, -4, 99, 51, 45, -37, 0, 0, 0, 32, 99, 72, 82, 77, 0, 0, 122, 37, 0, 0, -128, -125, 0, 0, -7, -1, 0, 0, -128, -23, 0, 0, 117, 48, 0, 0, -22, 96, 0, 0, 58, -104, 0, 0, 23, 111, -110, 95, -59, 70, 0, 0, 12, 28, 73, 68, 65, 84, 120, -38, -28, -101, 121, -116, 93, -25, 89, -58, 127, -17, 119, -50, 93, 102, -77, 61, 30, 123, 92, -57, 75, 50, 78, -20, 56, 33, -75, 98, -41, 105, -118, 80, 104, 65, 81, -86, -48, -46, 36, 13, 10, 73, 81, -35, 38, 113, 75, 82, -79, 73, 85, 41, -96, 74, 64, 5, 8, 33, 85, 8, 4, 77, 65, 98, 83, 36, -108, -86, 42, 80, -127, 42, -126, -108, -106, -4, -47, 10, 66, 19, 21, -95, -74, -79, 59, -34, -58, -53, -116, 103, -75, -81, 103, -58, 119, 57, -25, 123, -8, -29, -98, 59, 115, -18, 58, 119, -58, -109, 100, -94, -68, -46, -103, 123, -74, -5, 45, -49, -9, 46, -49, -5, 126, 115, 77, 18, -17, 100, 113, -68, -61, -27, 29, 15, 64, -104, -66, 56, -10, 87, 39, -72, 86, -116, -55, 56, 3, 64, 0, 6, 38, -112, -43, 110, 52, 72, -19, 126, -61, 115, 75, -2, -54, -110, -101, 74, -75, 85, 123, -35, 88, 122, 102, 6, 82, -61, 125, -64, 48, 36, 57, 32, 7, -20, -60, 108, 63, -80, 15, 36, -60, 40, 112, 2, -72, 12, -108, -21, -38, 55, -61, 92, -64, 87, 63, -77, -65, 123, 0, 54, -96, -28, -128, 109, -64, 71, -128, -97, 3, -69, -57, 96, -88, 58, 110, 3, -93, 34, 24, 71, 122, 9, 120, 1, -8, 46, 48, -65, 102, 13, -40, 64, -110, 1, 110, 7, 126, 9, -8, 24, 102, 123, -83, -59, 75, -126, -116, -63, 94, -52, -98, 4, -98, 20, -6, 103, -32, -71, 4, -120, -123, -73, 43, 0, 7, -128, -57, 13, -5, -43, 100, -11, -79, 54, 47, 90, -45, -75, 61, -126, -23, 17, -60, 87, 48, -5, 107, 115, -18, 44, 48, -9, 118, 1, 96, 23, -16, 33, -52, 62, 107, 85, 16, -42, 32, 2, 28, 97, 38, 124, -58, -57, -15, -93, -27, -21, -117, -1, 6, 60, -75, -79, 1, 16, 57, -32, 65, -32, 25, -61, 62, -72, -20, 34, -45, -109, -78, -106, -105, -53, -89, -43, 51, 23, -124, 88, 16, 80, 90, -72, -58, -20, -8, -39, -19, 11, 87, 102, 30, -121, 119, 111, 104, 0, -18, 51, -20, 73, -116, 39, -128, 124, 91, 93, -17, -92, -9, 120, -52, 28, 65, 38, 71, 84, 46, 113, 101, -4, 28, 83, 23, 70, 89, -68, 58, -125, -92, -23, -115, -22, 3, 110, 6, 62, 109, -40, -57, 48, 110, 89, -55, -78, 59, 97, 17, -124, 57, 0, 10, -45, -105, -104, 58, 63, 74, 97, -26, 50, 113, 84, 33, -56, 100, 48, 51, -37, 104, 0, 100, -127, -29, 6, -57, 49, 14, 87, 67, 121, -101, 41, 38, -68, -94, -23, 121, 114, -33, -71, 0, -105, -55, -80, 120, -19, 42, 83, -25, 79, 114, 117, -22, 34, -107, -30, 34, -26, 2, -62, 108, 118, 67, -122, -63, 7, 76, -4, 38, -16, 62, -96, 47, -119, -29, -99, -75, -66, -15, -71, -86, -116, 41, -52, -26, -120, 74, 69, 46, -97, 62, -55, -20, -8, 89, -118, 11, -41, 48, -125, 32, -109, 93, -11, -96, -34, 12, 0, -10, 27, -10, 121, -116, -113, 0, -37, 111, -92, -95, 32, -52, 34, -125, -39, -119, 115, 76, -98, 63, -55, -30, -43, 89, -112, 112, 65, 64, 23, -38, -2, -90, 3, -80, 13, -8, -108, 97, -49, 2, -69, 19, -106, -53, 90, -122, 89, -93, -75, -13, -123, 105, -90, -58, 78, 112, 117, 122, 28, 31, -5, -22, -60, -99, -35, -48, 32, -33, 8, 0, -14, -64, 35, -126, -33, 51, -45, -83, -120, -96, 69, -86, -48, -27, -52, 29, -50, 57, 74, -91, 69, -90, -50, -99, 100, 102, -4, 12, -34, -57, 4, 46, 32, 8, -41, 103, -24, -21, 9, 64, 15, 112, 55, -16, 69, 51, -69, -65, -39, -114, -123, 117, -71, -2, 102, 14, -52, -16, 81, -123, -87, -15, 51, 76, -115, -99, -96, 116, 125, -127, 32, 8, 9, -126, -11, 93, -77, -11, 104, -51, 37, -12, -11, 51, 85, -17, 110, 61, 29, -77, -58, 14, -47, -51, -52, 97, -50, 33, 31, 83, -104, -103, 96, 114, -20, 4, -13, 115, 83, -104, 115, 4, 97, 102, -7, -5, 43, 112, -91, -10, -95, 101, -3, 1, -40, 13, 60, 6, -4, -118, -63, 72, 53, -89, -83, 117, -82, -27, -68, -74, -47, -6, -101, 6, 107, 4, 65, -128, -128, -59, -62, 44, -45, -105, 78, 49, 59, 62, -122, -113, 35, -126, 48, -45, -20, -32, -46, 96, 90, 67, -56, -76, 84, -5, 122, -29, 0, -24, -85, -90, -89, 60, 99, -78, -97, -83, -101, 76, 106, 82, 117, -31, -85, 46, -100, -39, 114, 60, 15, 66, 44, 112, -108, 22, -82, 49, 119, 121, -116, -55, -117, -93, -108, 23, -25, 9, 51, 57, -62, -70, -80, -106, 20, 13, 106, -99, -104, 53, 61, -77, 70, 21, -80, 55, 6, -128, 15, 0, -57, -52, -20, -109, 117, 107, -39, 81, 13, 27, -72, 60, -32, -100, -61, -123, 89, 42, -91, -21, 92, -103, -72, -64, -12, -123, 81, 22, -26, -90, -79, 48, 36, -109, -19, 105, -79, 124, -42, -127, 25, 118, -49, 30, 111, 4, -128, -125, 86, -51, -69, 63, 14, -20, -84, -101, -96, 90, 100, 41, -115, 73, 90, -83, -84, 100, 70, 24, 102, -16, -14, 92, -103, 58, -49, -12, -123, 83, 92, -99, -66, -124, 98, 79, -112, -55, 99, -82, -6, -123, 90, 117, 104, 73, 97, 82, 42, 47, -91, 28, 106, -93, -70, 55, 46, -62, 58, 0, 48, 0, -10, -76, -63, 49, -32, 112, 93, 71, 117, -99, 90, -13, -54, 55, 60, -81, 101, 107, 11, -123, 25, -90, 46, -116, 114, -27, -14, 121, -94, 114, 17, 23, 102, 8, -78, -39, -70, 17, 91, -125, -53, 48, 51, -68, -9, 20, -117, 101, -62, 76, 64, 54, -52, 80, 87, -47, -18, 70, 49, -42, 0, -64, 35, 6, -49, 38, 106, -97, 105, 106, 116, -91, 78, -83, 102, -98, 70, 16, 102, 41, 21, 23, -104, 61, 123, -122, -103, -119, -45, -108, 22, 23, 48, 32, -52, -26, -69, 90, -82, 98, -87, -120, -9, -30, 39, 14, -34, 70, 38, -109, -31, -28, -87, -77, 120, -17, 113, 118, 99, 117, -35, -80, 77, 89, -31, -35, 6, -65, 101, 102, 15, 0, -37, -70, 51, -87, -42, -79, 39, 72, -44, 125, 118, -4, 12, -105, -57, 78, 114, 125, -2, 42, -56, 39, 68, -58, 86, 108, 34, -114, 61, -59, 82, -119, -19, -37, 6, -7, -87, 123, 14, 115, -28, -48, -99, 124, -17, -5, 63, -32, 71, 39, 79, -47, 114, 79, 67, -85, 114, 1, -11, 0, 120, 49, 36, -8, 28, -40, -57, 49, 110, 106, -39, -88, -38, -11, 97, -119, 125, 38, 42, 27, 4, 4, 65, -64, -4, -36, 52, 19, -25, 126, -60, -4, -36, 36, 62, -114, 49, 103, -104, 11, 91, 15, -68, 46, -17, 17, -91, 82, -103, 124, 62, -57, 79, -1, -28, 81, -114, 28, 58, -56, -32, -106, -51, -28, 114, 89, 98, 31, 39, -109, 111, 97, 118, 118, 3, 60, 96, -1, -114, -4, 95, -100, -98, 44, -2, 66, -95, -24, -61, -48, -79, 28, 127, -83, 67, -122, -42, -128, -110, 89, -11, 123, -91, -59, 2, 51, 23, 79, 51, 59, 121, -98, -72, 92, -62, -100, -61, -71, -96, 117, -92, 104, -104, 124, 37, -118, 112, -26, -72, -21, -32, 109, -36, 115, -28, 16, -69, -34, 85, -51, -95, 42, -107, -120, 48, 8, -86, -17, 43, -123, -38, 122, -15, -128, 93, 91, -13, 59, -74, 15, 100, -61, 51, -45, 69, -50, -49, -108, 41, 71, -98, -64, 25, -35, 37, 90, -43, -105, 92, 16, 18, -107, 75, 76, -100, -7, 33, -77, -29, -25, -80, 32, -64, -71, 54, -39, 90, -117, -56, 22, -59, 113, 121, 120, -37, -112, -35, 119, -17, -111, -52, 109, -73, -18, -59, -80, -44, -118, 55, -112, 31, 86, 88, -104, 46, -58, 93, -25, 65, -68, 87, -108, 9, -116, 59, 119, -10, -14, -66, 91, 7, -40, -71, -91, -22, -103, -29, -40, -29, -43, -115, 15, 96, -119, -67, -19, 61, 120, -108, 61, 119, 28, 37, -41, 59, -128, 124, -116, -68, 95, 105, 73, 124, 28, -57, -105, 64, -65, -15, -13, 15, -68, -1, -59, 59, 14, -20, -13, 62, -10, 68, 113, -100, -16, -88, -27, 89, -81, -25, 118, -90, 107, 53, -115, -78, 23, 3, 61, -114, -9, -36, -46, -49, -111, -101, -5, -39, -46, 23, -30, 37, 34, 47, -28, 85, 29, 65, -45, 81, 115, 16, 66, 62, -58, -52, 49, -68, -25, 0, -5, 15, -65, -97, -19, 123, 14, -32, 50, 89, 124, -20, -15, 62, 110, 34, -115, -64, 36, -16, 119, 81, 20, -33, 55, 52, -72, -27, -71, 77, 3, 125, -13, -27, 74, -59, -47, -106, 105, -87, 1, 74, 117, 118, 40, -85, -120, 2, -91, 90, -89, -111, 7, 103, 98, -25, 96, -106, -95, -127, -112, -79, -39, 50, -25, -90, -117, -52, 23, 61, 14, 8, -86, -63, 57, 113, 122, 106, -31, 12, 61, 113, 84, 34, -109, -51, -77, -5, -10, -61, 108, 30, -34, -51, -44, -40, 9, 10, -77, 19, -60, 81, -124, 25, 120, -81, 121, -55, -65, -116, -71, 63, 5, 94, 42, 20, -82, -15, -53, -97, 120, -116, -98, 124, 62, -88, 68, 81, -37, 108, -54, -80, 101, 98, 84, 99, 74, 105, 6, -98, -94, -38, -85, 5, 96, 46, -35, -99, 23, -108, 42, 34, 116, -114, 3, -61, 121, -122, -5, 51, -100, -101, 41, 49, 126, -91, -52, -11, 74, 76, 96, -32, -100, -75, 78, 116, 18, -14, -29, -29, 8, 124, -52, -90, -63, -19, -12, 109, 26, 100, -18, -14, 121, 102, 46, -98, -10, -41, -25, -25, 94, -55, -10, -9, -1, 121, 79, -33, -106, 23, -124, 20, 123, 24, -71, -59, 19, 6, -114, -40, -5, -107, -35, 77, 11, 62, 98, -35, -80, -26, -114, 0, 72, -29, -104, 53, 1, 87, -111, 39, -114, 96, -96, 39, -32, -82, -35, -67, 12, 111, -54, 48, 54, 83, 100, -14, 106, -123, 114, -28, -55, 56, -85, 82, 88, -75, 86, 84, -109, -120, -54, 37, 44, 8, 24, -70, 105, 31, 3, 91, -122, 53, 95, -104, 62, -39, 59, -80, -11, -27, -127, -51, -37, 21, 69, 37, 42, 18];
      var bout = Cc["@mozilla.org/binaryoutputstream;1"].getService(Ci.nsIBinaryOutputStream);
      bout.setOutputStream(this.pipe.outputStream);
      bout.writeByteArray(buff, buff.length);
      bout.close();
      //this.pipe.outputStream.write(result, result.length);
      //this.pipe.outputStream.close();
    } catch (err) {
      if (err.result != Cr.NS_BINDING_ABORTED) {
        Cu.reportError(err);
      }
    }
  },
  
  open: function () {
    return this.channel.open();
  },
  
  
  close: function () {
    this.pipe.outputStream.close();
  }
};


exports.SafeProtocolHandler = SafeProtocolHandler;