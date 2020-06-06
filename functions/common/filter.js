const errorPage = {
    notFound: function (req, res, next) {
        res.status(404).render('404');
    },

    serverError: function (err, req, res, next) {
        console.error(err);
        res.status(500).render('500');
    },
}


module.exports = {
    errorPage: errorPage,
};