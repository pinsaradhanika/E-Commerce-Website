module,exports = (theFunc) => (req,res,next)=>{
    Promise.resolve(theFunc(res,req,next)).catch(next);
};