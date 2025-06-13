// Profile Management
class ProfileManager {
  constructor() {
    this.user = null;
    this.addresses = [];
    this.initializeEventListeners();
    this.checkLoginStatus();
  }

  initializeEventListeners() {
    // Logout button
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }

    // Address form submission
    const addressForm = document.getElementById("addressForm");
    if (addressForm) {
      addressForm.addEventListener("submit", (e) =>
        this.handleAddressSubmit(e)
      );
    }

    // Quick address add bar
    const quickAddressForm = document.getElementById("quickAddressForm");
    if (quickAddressForm) {
      quickAddressForm.addEventListener(
        "submit",
        async function (e) {
          e.preventDefault();
          const input = document.getElementById("quickAddressInput");
          const addressText = input.value.trim();
          if (!addressText) return;
          // For demo: create a simple address object
          const addressData = {
            addressType: "home",
            streetAddress: addressText,
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
          };
          try {
            const response = await fetch("/api/users/addresses", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(addressData),
            });
            if (response.ok) {
              input.value = "";
              this.loadAddresses();
            }
          } catch (error) {
            // Optionally show error
          }
        }.bind(this)
      );
    }
  }

  checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser')); // fixed key
    const loginRequired = document.getElementById('loginRequired');
    const profileContent = document.getElementById('profileContent');

    if (user) {
        this.user = user;
        loginRequired.style.display = 'none';
        profileContent.style.display = 'block';
        this.loadUserProfile();
        this.loadAddresses();
    } else {
        loginRequired.style.display = 'block';
        profileContent.style.display = 'none';
    }
}

  loadUserProfile() {
    // Support both 'name' and 'fullName' for user name
    const name = this.user.name || this.user.fullName || "Not set";
    document.getElementById("userName").textContent = name;
    document.getElementById("userEmail").textContent =
      this.user.email || "Not set";
    // Support both string and undefined/null for phone
    document.getElementById("userPhone").textContent =
      this.user.phone || "Not set";
    // Support both string and undefined/null for address
    document.getElementById("userAddress").textContent =
      this.user.address || "Not set";
  }

  async loadAddresses() {
    try {
      const response = await fetch("/api/users/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        this.addresses = await response.json();
        this.renderAddresses();
      } else {
        console.error("Failed to load addresses");
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  }

  renderAddresses() {
    const addressCards = document.getElementById("addressCards");
    if (!addressCards) return;

    addressCards.innerHTML = "";

    this.addresses.forEach((address) => {
      const card = document.createElement("div");
      card.className = `address-card ${address.isDefault ? "default" : ""}`;
      card.innerHTML = `
                <span class="address-type">${address.addressType}</span>
                <div class="address-content">
                    <p>${address.streetAddress}</p>
                    <p>${address.city}, ${address.state} ${
        address.postalCode
      }</p>
                    <p>${address.country}</p>
                </div>
                <div class="address-actions">
                    <button class="edit-address" onclick="profileManager.editAddress('${
                      address.id
                    }')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-address" onclick="profileManager.deleteAddress('${
                      address.id
                    }')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${
                      !address.isDefault
                        ? `
                        <button class="set-default" onclick="profileManager.setDefaultAddress('${address.id}')">
                            <i class="fas fa-star"></i> Set as Default
                        </button>
                    `
                        : ""
                    }
                </div>
            `;
      addressCards.appendChild(card);
    });
  }

  async handleAddressSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      addressType: formData.get("addressType"),
      streetAddress: formData.get("streetAddress"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
      isDefault: formData.get("isDefault") === "true",
    };

    try {
      const response = await fetch("/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        this.showMessage("Address added successfully", "success");
        this.loadAddresses();
        this.closeAddressModal();
      } else {
        this.showMessage("Failed to add address", "error");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      this.showMessage("Error adding address", "error");
    }
  }

  async editAddress(addressId) {
    const address = this.addresses.find((addr) => addr.id === addressId);
    if (!address) return;

    // Populate form with address data
    const form = document.getElementById("addressForm");
    form.addressType.value = address.addressType;
    form.streetAddress.value = address.streetAddress;
    form.city.value = address.city;
    form.state.value = address.state;
    form.postalCode.value = address.postalCode;
    form.country.value = address.country;
    form.isDefault.value = address.isDefault;

    // Show modal
    this.openAddressModal(addressId);
  }

  async deleteAddress(addressId) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/users/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        this.showMessage("Address deleted successfully", "success");
        this.loadAddresses();
      } else {
        this.showMessage("Failed to delete address", "error");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      this.showMessage("Error deleting address", "error");
    }
  }

  async setDefaultAddress(addressId) {
    try {
      const response = await fetch(
        `/api/users/addresses/${addressId}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        this.showMessage("Default address updated", "success");
        this.loadAddresses();
      } else {
        this.showMessage("Failed to update default address", "error");
      }
    } catch (error) {
      console.error("Error updating default address:", error);
      this.showMessage("Error updating default address", "error");
    }
  }

  openAddressModal(addressId = null) {
    const modal = document.getElementById("addressModal");
    const form = document.getElementById("addressForm");

    // Reset form if adding new address
    if (!addressId) {
      form.reset();
    }

    modal.classList.add("active");
  }

  closeAddressModal() {
    const modal = document.getElementById("addressModal");
    modal.classList.remove("active");
  }

  handleLogout() {
    localStorage.removeItem("currentUser"); // fixed key
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `profile-message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// Initialize profile manager when DOM is loaded
let profileManager;
document.addEventListener("DOMContentLoaded", () => {
  profileManager = new ProfileManager();
});
