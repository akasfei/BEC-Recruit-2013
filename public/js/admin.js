$(document).ready(function (e) {
  $('.access-btn').click(function (e) {
    $.ajax({
      url: '/admin',
      data: {
        accesscode: $('#accesscode').val()
      },
      type: 'POST',
      success: function (data, status) {
        $('.jumbotron').slideUp();
        $('.manage').append(data.html);
      },
      error: function (jqxhr, status, err) {
        alert(err);
      }
    });
  });

  $('.manage').on('click', '.remove-enrty', function (e){
    var c = confirm('确定删除？');
    if (c == true) {
      $this = $(this);
      $.ajax({
        url: '/admin/manage',
        data: {
          objid: $this.parent().attr('data-objid')
        },
        type: 'POST',
        success: function (data, status) {
          $this.parents('.app-table').remove();
        },
        error: function (jqxhr, status, err) {
          alert(err);
        }
      });
    }
  });
});