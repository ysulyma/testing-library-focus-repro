import { Autocomplete } from "@mui/material";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const strings = {
  addNew: "Add new",
  cancel: "Cancel",
  placeholder: "Enter a name",
};

const modalStrings = {
  title: "Modal title",
  trigger: "Modal trigger",
  description: "Modal description",
  cancel: "Close modal",
};

export function DebugComponent() {
  const addNewRef = useRef<React.ComponentRef<typeof AddNew>>(null);
  const options = ["Test"];

  return (
    <Autocomplete
      filterOptions={(options) => options}
      freeSolo
      onChange={() => {
        addNewRef.current?.open();
      }}
      open
      options={options}
      renderInput={(params) => (
        <div key="div" ref={params.InputProps.ref}>
          <input placeholder={strings.placeholder} {...params.inputProps} />
        </div>
      )}
      renderOption={(props) => {
        return <AddNew key="add-new" {...props} ref={addNewRef} />;
      }}
    />
  );
}

const AddNew = forwardRef<{ open(): void }>(function AddNew(props, ref) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
  }));

  return (
    <li {...props}>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>{modalStrings.trigger}</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>{modalStrings.title}</AlertDialog.Title>
            <AlertDialog.Description>
              {modalStrings.description}
            </AlertDialog.Description>

            {/* it works if I comment out the following line */}
            <AlertDialog.Cancel>{modalStrings.cancel}</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </li>
  );
});

describe("issue reproduction", () => {
  it("should open the modal and not explode", async () => {
    const { container, getByPlaceholderText } = render(<DebugComponent />);

    const doc = within(container.ownerDocument.body);

    const input = getByPlaceholderText(strings.placeholder);

    // it works if I comment out the following line
    await userEvent.type(input, "Dennis");
    await userEvent.type(input, "{ArrowDown}{Enter}");

    // expect modal to be opened
    const modal = await doc.getByText(modalStrings.title);
    expect(modal).toBeInTheDocument();
  });
});
