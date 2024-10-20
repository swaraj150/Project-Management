export const formatDate = (dateString) => {
  const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
  }

  const date = new Date(dateString)

  return date.toLocaleDateString('en-IN', options)
}

export const formatBudget = (budget) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(budget)
}