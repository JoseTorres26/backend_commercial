const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', async (req, res) => {
  try {
   const categoryData = await Category.findAll();
   res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
    try {
        const categoryData = await Category.findAByPk(req.params.id);
        if (!categoryData) {
            res.status(404).json({ message: 'No' });
            return;
          }
      
        res.status(200).json(categoryData)
       } catch (err) {
         res.status(500).json(err)
       }
});

router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData)
} catch (err) {
  res.status(500).json(err)
}
});

router.put('/:id', async (req, res) => {
    try {
        const categoryData = await Category.update(req.body, {
          where: {
            id: req.params.id
          }
        });
    
        if (!categoryData) {
          res.status(404).json({ message: 'Category not found' });
        } else {
          res.status(200).json({ message: 'Category updated successfully' });
        }
      } catch (err) {
        res.status(500).json(err);
      }
});

router.delete('/:id', async  (req, res) => {
    try {
        const categoryData = await Category.destroy({
          where: {
            id: req.params.id
          }
        });
    
        if (!categoryData) {
          res.status(404).json({ message: 'No location found with this id!' });
          return;
        }
    
        res.status(200).json(categoryData);
      } catch (err) {
        res.status(500).json(err);
      }
});

module.exports = router;