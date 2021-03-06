var express = require('express');
var router = express.Router();
var product = require('../models/product');

router.get('/product/:id?', function (req, res) {
   if (req.params.id) {
      product.getProductById(req.params.id, function (err, rows) {
         if (err) {
            return res.status(500).send({
               message: 'Error in de database.'
            });
         } else {
            if (rows == 0) {
               return res.status(404).send({
                  message: 'This product does not exist.'
               });
            } else {
               res.json(rows);
            }
         }
      });
   } else {
      product.getAllProducts(function (err, rows) {
         if (err) {
            return res.status(500).send({
               message: 'Error in de database.'
            });
         } else {
            res.json(rows);
         }
      });
   }
});

router.post('/product', function (req, res) {
   if (req.body.product_name == "" || req.body.unit_price == "") {
      return res.status(400).send({
         message: 'Missing name or price.'
      });
   } else {
      product.addProduct(req.body, function (err) {
         if (err) {
            return res.status(500).send({
               message: 'Error in de database.'
            });
         } else {
            return res.status(200).send({
               message: 'Product has been succesfully created.'
            });
         }
      });
   }
});

router.put('/product/:id', function (req, res) {
   if (req.body.product_name == "" || req.body.product_price == "") {
      return res.status(400).send({
         message: 'Missing name or price.'
      });
   } else {
      product.updateProduct(req.params.id, req.body, function (err, rows) {
         if (err) {
            return res.status(500).send({
               message: 'Error in de database.'
            });
         } else {
            if (rows.affectedRows == 0) {
               return res.status(404).send({
                  message: 'This product does not exist.'
               });
            } else {
               return res.status(200).send({
                  message: 'Product has been succesfully updated.'
               });
            }
         }
      });
   }
});

router.delete('/product/:id', function (req, res) {
   product.deleteProduct(req.params.id, function (err, rows) {
      if (err) {
         return res.status(500).send({
            message: 'Error in de database.'
         });
      } else {
         if (rows.affectedRows == 0) {
            return res.status(404).send({
               message: 'This product does not exist.'
            });
         } else {
            product.deleteCartOrder(req.params.id, function (rows) {
               if (rows.affectedRows > 0) {
                  product.getCartIds(rows, function (rows) {
                     if (rows.length > 0) {
                        product.deleteCart(rows, function () {});
                     }
                  });
               }
            });
            return res.status(200).send({
               message: 'Product has been succesfully deleted.'
            });
         }
      }
   });
});

module.exports = router;