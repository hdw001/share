(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var console = window.console || { log: function () {} };

  function CropAvatar($element) {

      this.$container = $element;

      this.$avatarView = this.$container.find('.avatar-view');
      this.$avatar = this.$avatarView.find('img');
      this.$avatarModal = $("body").find('#avatar-modal');
      this.$loading = this.$avatarModal.find('.loading');

      this.$avatarForm = this.$avatarModal.find('.avatar-form');
      this.$avatarUpload = this.$avatarForm.find('.avatar-upload');
      this.$avatarScale = this.$avatarForm.find('.avatar-scale').val();
      this.$avatarSrc = this.$avatarForm.find('.avatar-src');
      this.$avatarData = this.$avatarForm.find('.avatar-data');
      this.$avatarInput = this.$avatarForm.find('.avatar-input');
      this.$avatarSave = this.$avatarForm.find('.avatar-save');
      this.$avatarBtns = this.$avatarForm.find('.avatar-btns');

      this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
      this.$avatarPreview = this.$avatarModal.find('.avatar-preview');

      this.init();
  }

  // 对象添加属性和方法
  CropAvatar.prototype = {
    constructor: CropAvatar,

    support: {
      fileList: !!$('<input type="file">').prop('files'),// prop 获取属性 返回真或假
      blobURLs: !!window.URL && URL.createObjectURL,
      formData: !!window.FormData
    },

    init: function () {
      this.support.datauri = this.support.fileList && this.support.blobURLs;

      if (!this.support.formData) {
        this.initIframe();
      }

      this.initTooltip();
      this.initModal();
      this.addListener();
    },
    // 添加监听事件
    addListener: function () {
      this.$avatarView.on('click', $.proxy(this.click, this));//头像点击事件
      this.$avatarInput.on('change', $.proxy(this.change, this));//选择文件时的变化事件
      this.$avatarForm.on('submit', $.proxy(this.submit, this));//表单提交事件
      this.$avatarBtns.on('click', $.proxy(this.rotate, this));//旋转按钮点击事件
    },
    // 提示工具栏，移动到头像时显示提示
    initTooltip: function () {
      this.$avatarView.tooltip({
        placement: 'top'
      });
    },
    // 初始化模态框,默认隐藏
    initModal: function () {
      this.$avatarModal.modal({
        show: false
      });
    },
    // 模态框预览时，右侧显示头像，显示当前用户头像
    initPreview: function () {
      var url = this.$avatar.attr('src');

      this.$avatarPreview.empty().html('<img src="' + url + '">');
    },
    // 初始化隐藏的上传框架，截取
    initIframe: function () {
      var target = 'upload-iframe-' + (new Date()).getTime(),
          $iframe = $('<iframe>').attr({
            name: target,
            src: ''
          }),
          _this = this;

      // Ready ifrmae
      $iframe.one('load', function () {

        // respond response
        $iframe.on('load', function () {
          var data;

          try {
            data = $(this).contents().find('body').text();
          } catch (e) {
            console.log(e.message);
          }

          if (data) {
            try {
              data = $.parseJSON(data);
            } catch (e) {
              console.log(e.message);
            }

            _this.submitDone(data);
          } else {
            _this.submitFail('头像上传失败!');
          }

          _this.submitEnd();

        });
      });

      this.$iframe = $iframe;
      this.$avatarForm.attr('target', target).after($iframe.hide());
    },
    // 点击事件，模态框显示，预览初始化
    click: function () {
      this.$avatarModal.modal('show');
      this.initPreview();
    },
    // 更改事件
    change: function () {
      var files,
          file;

      if (this.support.datauri) {
        files = this.$avatarInput.prop('files');

        if (files.length > 0) {
          file = files[0];

          if (this.isImageFile(file)) {//判断文件格式
            if (this.url) {//现在的选择的图像的链接存在
              URL.revokeObjectURL(this.url); // 撤销旧的，链接
            }

            this.url = URL.createObjectURL(file);//当前这个链接为现在选择头像的链接
            this.startCropper();//开始截取
          } else {
              this.alert('请上传图片格式文件,例如:jpg|jpeg|png|gif');
              return false;
          }
        }
      } else {
        file = this.$avatarInput.val();

        if (this.isImageFile(file)) {
          this.syncUpload();// 同步上传
        }
      }
    },
    // 提交数据，上传数据
    submit: function () {
      // 提交数据不为空，一处为空都false
      if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
        this.alert('请选择文件！');
        return false;
      }
      // 将整个表单数据formData格式上传
      if (this.support.formData) {
        this.ajaxUpload();
        return false;
      }
    },
    // 旋转角度数据
    rotate: function (e) {
      var data;

      if (this.active) {
        data = $(e.target).data();

        if (data.method) {
          this.$img.cropper(data.method, data.option);//获取图像处理数据
        }
      }
    },
    // 判断是否是图像文件
    isImageFile: function (file) {
      if (file.type) {
        return /^image\/\w+$/.test(file.type);
      } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
      }
    },
    // 开始截取
    startCropper: function () {
      var _this = this;

      // 判断当前截取框是不是动态，使用
      if (this.active) {
        this.$img.cropper('replace', this.url);
      } else {
        this.$img = $('<img src="' + this.url + '">');
        this.$avatarWrapper.empty().html(this.$img);
        this.$img.cropper({
          aspectRatio: 1,
          preview: this.$avatarPreview.selector,
          strict: false,
          crop: function (data) {
            var json = [
              '{"x":' + data.x,
              '"y":' + data.y,
              '"height":' + data.height,
              '"width":' + data.width,
              '"rotate":' + data.rotate + '}'
            ].join();

            _this.$avatarData.val(json);
          }
        });

        this.active = true;
      }
    },
    // 停止截取
    stopCropper: function () {
      if (this.active) {
        this.$img.cropper('destroy');
        this.$img.remove();
        this.active = false;
      }
    },
    // 异步上传
    ajaxUpload: function () {
      var url = this.$avatarForm.attr('action'),
          data = new FormData(this.$avatarForm[0]),
          _this = this;

      $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

      $.ajax(url, {
        type: 'post',
        data: data,
        dataType: 'json',
        processData: false,
        contentType: false,

        beforeSend: function () {
          _this.submitStart();
        },

        success: function (data) {
          _this.submitDone(data);
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var number = XMLHttpRequest.status;
            var info = "错误号:"+number+",文件上传失败";
            _this.submitFail(info);
          // _this.submitFail(textStatus || errorThrown);
        },

        complete: function () {
          _this.submitEnd();
        }
      });
    },

    syncUpload: function () {
      this.$avatarSave.click();
    },

    submitStart: function () {
      this.$loading.fadeIn();
    },

    submitDone: function (data) {
      console.log(data);

      if ($.isPlainObject(data) && data.StatusCode === '200') {
        if (data.ResultData) {
          this.url = data.ResultData;

          if (this.support.datauri || this.uploaded) {
            this.uploaded = false;
            this.cropDone();
          } else {
            this.uploaded = true;
            this.$avatarSrc.val(this.url);
            this.startCropper();
          }

          this.$avatarInput.val('');
        } else if (data.ResultData) {
          this.alert(data.ResultData);
        }
      } else {
        this.alert(data.ResultData);
      }
    },

    submitFail: function (msg) {
      this.$avatarInput.val('');
      this.alert(msg);
    },

    submitEnd: function () {
      this.$loading.fadeOut();
    },

    cropDone: function () {
      this.$avatarForm.get(0).reset();
      this.$avatar.attr('src', this.url);
      $('.user_avatar').attr('src', this.url);
      $('#topAvatar').attr('src', this.url);
      this.stopCropper();
      this.$avatarModal.modal('hide');
    },

    alert: function (msg) {
      var $alert = [
        '<div class="alert alert-danger avater-alert">',
        '<button type="button" class="close" data-dismiss="alert">&times;</button>',
        msg,
        '</div>'
      ].join('');

      this.$avatarUpload.after($alert);
    }
  };

  $(function () {
      return new CropAvatar($('#crop-avatar'));
  });
});
