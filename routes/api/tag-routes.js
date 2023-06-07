const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const tagData = await Tag.findAll()
        res.status(200).json(tagData);
      } catch (err) {
        res.status(500).json(err);
      }
});

router.get('/:id', async (req, res) => {
    try {
        const tagData = await Tag.findByPk(req.params.id, {
            include: [{ model: Category}, 
                      { model: Product,
                        through: ProductTag
                    }]
        });
        if (!tagData) {
            res.status(404).json({ message: 'No' });
            return;
          }
        res.status(200).json(tagData);
      } catch (err) {
        res.status(500).json(err);
      }
});

router.post('/', async (req, res) => {
    try {
        const tagData = await Tag.create(req.body);
    
        if (req.body.productIds.length) {
            const productTagIdArr = req.body.productIds.map((product_id) => {
              return {
                tag_id: tag.id,
                product_id,
                
              };
            });
            await ProductTag.bulkCreate(productTagIdArr);
          }
          res.status(200).json(tagData)
      } catch (err) {
        console.log(err);
      res.status(400).json(err);
      }
});

router.put('/:id', (req, res) => {
    Tag.update(req.body, {
        where: {
          id: req.params.id,
        },
      })
        .then((tag) => {
          if (req.body.productIds && req.body.productIds.length) {
    
            ProductTag.findAll({
              where: { product_id: req.params.id }
            }).then((productTags) => {
              const productTagIds = productTags.map(({ product_id }) => product_id);
              const newProductTags = req.body.productIds
                .filter((product_id) => !productTagIds.includes(product_id))
                .map((product_id) => {
                  return {
                    tag_id: tag.id,
                    product_id,
                }
            });
        
              const productTagsToRemove = productTags
                .filter(({ product_id }) => !req.body.productIds.includes(product_id))
                .map(({ id }) => id);
            
              return Promise.all([
                ProductTag.destroy({ where: { id: productTagsToRemove } }),
                ProductTag.bulkCreate(newProductTags),
              ]);
            });
          }
    
          return res.json(tag);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedTag = await Tag.destroy({
          where: { id: req.params.id},
        });
    
        if (!deletedTag) {
          return res.status(404).json({ message: 'Tag not found' });
        }
    
        if (req.body.productIds && req.body.productIds.length) {
          await ProductTag.destroy({
            where: {
              tag_id: id,
              product_id: req.body.productIds,
            },
          });
        }
    
        res.status(200).json({ message: 'Tag and associated Products deleted successfully' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
});

module.exports = router;