exports.get_success = (req, res) => {
    res.send(req.user);
};

exports.get_fail = (req, res) => {
    res.send('facebook login fail');
};