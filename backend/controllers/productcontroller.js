exports.getproducts = (req, res, next)=>{
    res.status(200).json({
        sucess : true,
        massage : "this route will show all the products in databases"
    })
}