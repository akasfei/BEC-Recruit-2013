$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}; // convert form to json

$(document).ready(function (e){
  $('#form-submit').click(function (e) {
    var $this = $(this);
    var data = $('#apply-form').serializeObject();
    $this.button('loading');
    $.ajax({
      url: '',
      data: data,
      type: 'POST',
      success: function (data, status) {
        $this.button('reset');
        $('#apply-form .alert-success').removeClass('hidden');
      },
      error: function (jqxhr, status, err) {
        $this.button('reset');
        $('#error-text').text(err);
        $('#apply-form .alert-danger').removeClass('hidden');
      }
    });
  });
});