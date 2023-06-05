const isAuthenticated = require("../middleware/isAuthenticated");
const Valuation = require("../models/Valuation.model");
const router = require("express").Router();

//GET "/valuation/:gameId" =>Get all game valuation
router.get("/:gameId", isAuthenticated, async (req, res, next) => {
  try {
    const allValuations = await Valuation.find({
      gameId: { $in: [req.params.gameId] },
    }).populate("owner");
    res.json(allValuations);
  } catch (error) {
    next(error);
  }
});

//POST "/valuation/:gameId" => Create a new valuation
router.post("/:gameId", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  try {
    const { content, value } = req.body;
    await Valuation.create({
      owner: userId,
      gameId: req.params.gameId,
      content,
      value,
    });
    res.json("Valuation created");
  } catch (error) {
    next(error);
  }
});
//DELETE "/valuation/:valuationId" => Delete a valuation
router.delete("/:valuationId", isAuthenticated, async (req, res, next) => {
  try {
    await Valuation.findByIdAndDelete(req.params.valuationId);
    res.json("Valuation deleted");
  } catch (error) {
    next(error);
  }
});

//PATCH "/valuation/:valuationId/handle-like" => push/pull a new reaction to the comment
router.patch("/:valuationId/handle-like", isAuthenticated, async (req, res, next) =>{
  const userId = req.payload._id;
  try {
    
    //checking if the user already did a reaction and deleting in that case
    const valuation = await Valuation.findById(req.params.valuationId);
    if(valuation.likes.includes(userId)) {
      await Valuation.findByIdAndUpdate(req.params.valuationId, {$pull: { likes: userId}});
      res.json("Like deleted");
    }

    await Valuation.findByIdAndUpdate(req.params.valuationId, {$push: { likes: userId}});
    res.json("Reaction added");
  } catch (error) {
      next(error);
  }
});

//PATCH "/valuation/:valuationId/handle-love" => push/pull a new reaction to the comment
router.patch("/:valuationId/handle-love", isAuthenticated, async (req, res, next) =>{
  const userId = req.payload._id;
  try {

    //checking if the user already did a reaction and deleting in that case
    const valuation = await Valuation.findById(req.params.valuationId);
    if(valuation.likes.includes(userId)) {
      await Valuation.findByIdAndUpdate(req.params.valuationId, {$pull: { loves: userId}});
      res.json("Reaction deleted");
    }

    await Valuation.findByIdAndUpdate(req.params.valuationId, {$push: { loves: userId}});
    res.json("Reaction added");
  } catch (error) {
      next(error);
  }
});


//PATCH "/valuation/:valuationId/add-dislike" => push/pull a new reaction to the comment
router.patch("/:valuationId/dislike-like", isAuthenticated, async (req, res, next) =>{
  const userId = req.payload._id;
  try {
     //checking if the user already did a reaction and deleting in that case
     const valuation = await Valuation.findById(req.params.valuationId);
     if(valuation.likes.includes(userId)) {
      await Valuation.findByIdAndUpdate(req.params.valuationId, {$pull: { dislikes: userId}});;
       res.json("Reaction deleted");
     }

    await Valuation.findByIdAndUpdate(req.params.valuationId, {$push: { dislikes: userId}});
    res.json("Reaction added");
  } catch (error) {
      next(error);
  }
});


module.exports = router;
