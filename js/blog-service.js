class BlogService {
    constructor() {
        if (!BlogService._instance) BlogService._instance = this;
        return BlogService._instance;
    }
    async getBlog() {
        if (!this.blog) {
            this.blog = await (await fetch('blog.json')).json();
        }
        return this.blog;
    }
    async getBlogById(id) {
        const blog = await this.getBlog();
        return blog.find( blog => blog.id === id );
    }
}
