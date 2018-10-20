class Vue {
    constructor(options) {
        this.$el = options.el; // 挂载
        this.$data = options.data;

        // 如果有要编译的模板就开始编译
        if (this.$el) {
            // 数据劫持
            new Observer(this.$data);
            // 用数据和元素进行编译
            new Compile(this.$el, this)
        }
    }
}
