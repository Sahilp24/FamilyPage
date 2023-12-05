import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Container,
  Card, CardHeader, CardContent, TextField, Radio, RadioGroup,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControlLabel, FormControl, FormLabel, List, ListItem, ListItemText,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBowlFood,
  faCancel,
  faEdit,
  faPlusCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore';
import {Link } from "react-router-dom";
import './Recipe.css';

const Recipe = () => {  
  const recipeCollection = collection(database, 'recipes');
  const [recipes, setRecipes] = useState([]);
  const [currRecipe, setCurrRecipe] = useState({
    recipeName: '',
    ingredients: '',
    instructions: '',
    difficulty: 'easy',
    isComplete: false,
  });

  const [errors, setErrors] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [addUpdateFlag, setAddUpdateFlag] = useState(true);

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const handleModalOpenAdd = () => {
    setOpenModal(true);
    setAddUpdateFlag(true);
    setCurrRecipe({
      recipeName: '',
      ingredients: '',
      instructions: '',
      difficulty: 'easy',
      servings: '',
    });
  };

  const handleModalOpenUpdate = (recipe) => {
    setOpenModal(true);
    setAddUpdateFlag(false);
    recipe.ingredients = recipe.ingredients.toString();
    setCurrRecipe(recipe);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrRecipe({
      ...currRecipe,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleCompleteToggle = (recipeID) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeID ? { ...recipe, isComplete: !recipe.isComplete } : recipe
      )
    );
  };

  const validateRecipeName = (newErrors) => {
    if (!currRecipe.recipeName) {
      newErrors.recipeName = 'Recipe Name is required';
    } 
    return newErrors;
  };

  const validateIngredients = (newErrors) => {
    if (!currRecipe.ingredients) {
      newErrors.ingredients = 'Ingredents are required';
    }
    return newErrors;
  }

  const validateInstructions = (newErrors) => {
    if (!currRecipe.instructions) {
      newErrors.instructions = 'Instructions is required';
    }
    return newErrors;
  }

  const validateDifficulty = (newErrors) => {
    if (!currRecipe.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }
    return newErrors;
  }

  const validateServings = (newErrors) => {
    if (!currRecipe.servings) {
      newErrors.servings = 'Servings are required';
    }
    return newErrors;
  }

  const validateFormAdd = () => {
    var newErrors = {};

    newErrors = validateRecipeName(newErrors);
    newErrors = validateIngredients(newErrors);
    newErrors = validateInstructions(newErrors);
    newErrors = validateDifficulty(newErrors);
    newErrors = validateServings(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function deleteOurDoc (docToDelete){
    await deleteDoc(docToDelete)
  }

  async function updateOurDoc (docToUpdate){
    await updateDoc(docToUpdate, {
      ...currRecipe,
    })
  }

  async function addOurDoc (collectionNameToBeAdded, newDataToBeAdded) {
    const newDoc = await addDoc(collectionNameToBeAdded, {
      ...newDataToBeAdded,
    })
      .then(console.log("Saved to Firebase database"));
    return newDoc;
  }

  const addRecipe = async () => {
    if (!validateFormAdd()) {
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    currRecipe.ingredients = currRecipe.ingredients.split(',');
    addOurDoc(recipeCollection, currRecipe);

    setCurrRecipe({
      recipeName: '',
      ingredients: '',
      instructions: '',
      difficulty: 'easy',
      servings: '',
    });
    handleModalClose();
    fetchData();
    toast.success('Recipe added successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const validateFormUpdate = () => {
    var newErrors = {};

    newErrors = validateRecipeName(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateRecipe = () => {
    if (!validateFormUpdate()) {
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    currRecipe.ingredients = currRecipe.ingredients.split(',');
    const docToUpdate = doc(database, "recipes", currRecipe.id);
    updateOurDoc(docToUpdate);

    /*
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === currRecipe.id ? { ...recipe, ...currRecipe } : recipe
      )
    );
    */
    setCurrRecipe({
      recipeName: '',
      ingredients: '',
      instructions: '',
      difficulty: 'easy',
      servings: '',
    });
    handleModalClose();
    fetchData();

    toast.success('Recipe updated successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  function removeRecipeByID(id) {
    //setRecipes((prevRecipes) => prevRecipes.filter((obj) => obj.id !== id));
    const docToDelete = doc(database, "recipes", id);
    deleteOurDoc(docToDelete);
    fetchData();
    toast.success('Recipe successfully deleted!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(recipeCollection); // Replace 'yourCollectionName' with your actual collection name
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  async function refreshRecipeTable() {
    const querySnapshot = await getDocs(recipeCollection);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
});
  }


  return (
    <Container maxWidth="xl" style={{ width: '100%', padding: '1px', marginTop: '1px', minHeight: '100vh' }}>
      <ToastContainer />

      <Card>
        <CardHeader 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" style={{ color: 'white', textAlign: 'left' }}>
                <FontAwesomeIcon icon={faBowlFood} style={{ marginRight: '8px' }} />
                RECIPES
                </Typography>
                {/*<div>
                    <Link to="/Home">
                    <Button variant="text" sx={{ color: 'white'}} style ={{ marginLeft: '25px'}} >Home </Button>
                    </Link>
                    <Link to="/Travel">
                    <Button variant="text" sx={{ color: 'white'}} style ={{ marginLeft: '5px'}} >Travel </Button>
                    </Link>
                </div>*/}
            </div>
            
          }
          action={
            <div>
              <Button variant="contained" color="secondary" onClick={handleModalOpenAdd} style ={{marginRight: '3px'}}>
                <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
                Add
              </Button>
              
            </div>
          }
          style={{ backgroundColor: '#2196F3' }}
        />
        <CardContent style={{ alignItems: 'center', textAlign: 'left'}}>
          <div class='recipe-grid'>
                {recipes.map((recipe) => (
                    <div className="recipe-card">
                    <div className="recipe-card-title">
                      <h3>{recipe.recipeName}</h3>
                    </div>
                    <p class = 'recipe-detail-title'>Ingredients:</p> 
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <p> <span class = 'recipe-detail-title'>Instructions:</span> {recipe.instructions}</p>
                    <p> <span class = 'recipe-detail-title'>Difficulty:</span> {recipe.difficulty}</p>
                    <p> <span class = 'recipe-detail-title'>Servings:</span> {recipe.servings}</p>
                    <Button
                        onClick={() => handleModalOpenUpdate(recipe)}
                        color="primary"
                        variant="contained"
                      >
                        <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
                        Update
                      </Button>
                    <Button
                      onClick={() => removeRecipeByID(recipe.id)}
                      variant="contained"
                      sx={{ bgcolor: 'red' }}
                    >
                      <FontAwesomeIcon icon={faXmarkCircle} style={{ marginRight: '8px' }} />
                      Delete
                    </Button>
                  </div>
                ))}            
            </div>


        </CardContent>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addRecipe();
          }}
        >
          {/* ... (same as before) */}
        </form>
      </Card>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>
          {addUpdateFlag ? (
            <>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add Recipe
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Edit Recipe
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {addUpdateFlag ? (
            <TextField
              label="Recipe Name"
              name="recipeName"
              value={currRecipe.recipeName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!errors.recipeName}
              helperText={errors.recipeName}
            />
          ) : null}
          <TextField
            label="Ingredients (Enter as comma-separated)"
            name="ingredients"
            value={currRecipe.ingredients}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.ingredients}
            helperText={errors.ingredients}
            multiline
            rows={4}
          />
          <TextField
            label="Instructions"
            name="instructions"
            value={currRecipe.instructions}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.instructions}
            helperText={errors.instructions}
          />
          <TextField
            label="Servings"
            name="servings"
            value={currRecipe.servings}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.servings}
            helperText={errors.servings}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Difficulty</FormLabel>
            <RadioGroup
              aria-label="difficulty"
              name="difficulty"
              value={currRecipe.difficulty}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="med" control={<Radio />} label="Medium" />
              <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            </RadioGroup>
            {errors.difficulty && (
              <Typography variant="caption" color="red">
                {errors.difficulty}
                helperText={errors.difficulty}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          {addUpdateFlag ? (
            <Button onClick={addRecipe} color="primary" variant="contained" sx={{ width: '25%' }}>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add
            </Button>
          ) : (
            <Button onClick={updateRecipe} color="primary" variant="contained" sx={{ width: '25%' }}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Update
            </Button>
          )}
          <Button onClick={handleModalClose} variant="contained" sx={{ bgcolor: 'red', width: '25%' }}>
            <FontAwesomeIcon icon={faCancel} style={{ marginRight: '8px' }} />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recipe;